import {
  env,
  pipeline,
} from "../../assets/vendor/transformers/transformers.min.js";

const MODEL = "onnx-community/Qwen2.5-0.5B-Instruct";
const REVISION = "22942cb7d7ba4cc81bb4673549ca4d4614469b5e";
env.allowLocalModels = false;
env.backends.onnx.wasm.numThreads = 1;
env.backends.onnx.wasm.wasmPaths = new URL(
  "../../assets/vendor/transformers/",
  import.meta.url,
).href;

let generator;
self.onmessage = async ({
  data: { id, prompt, maxTokens, prefix, choices },
}) => {
  try {
    generator ??= await pipeline("text-generation", MODEL, {
      revision: REVISION,
      dtype: "q8",
      device: "wasm",
      progress_callback: ({ status, progress, file }) => {
        if (status === "progress" && file.endsWith(".onnx"))
          self.postMessage({ id, progress: progress / 100 });
      },
    });
    if (prompt === null) {
      self.postMessage({ id, result: "" });
      return;
    }
    const messages = [{ role: "user", content: prompt }];
    const input = prefix
      ? generator.tokenizer.apply_chat_template(messages, {
          tokenize: false,
          add_generation_prompt: true,
        }) + prefix
      : messages;
    const logits_processor = choices?.length
      ? [
          (_tokens, logits) => {
            const allowed = choices
              .flatMap((choice) => [choice, " " + choice])
              .map((choice) =>
                generator.tokenizer.encode(choice, {
                  add_special_tokens: false,
                }),
              )
              .filter((ids) => ids.length === 1)
              .map(([token]) => Number(token));
            const values = allowed.map((token) => logits.data[token]);
            logits.data.fill(-Infinity);
            allowed.forEach((token, index) => {
              logits.data[token] = values[index];
            });
            return logits;
          },
        ]
      : undefined;
    const output = await generator(input, {
      max_new_tokens: choices?.length ? 1 : maxTokens || 250,
      do_sample: false,
      return_full_text: false,
      ...(logits_processor ? { logits_processor } : {}),
    });
    const generated = output[0]?.generated_text;
    const result =
      typeof generated === "string" ? generated : generated?.at(-1)?.content;
    if (!result?.trim()) throw new Error("The model returned no text.");
    self.postMessage({ id, result });
  } catch (error) {
    self.postMessage({ id, error: error.message || "The local model failed." });
  }
};
