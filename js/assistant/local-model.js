const preference = "portfolio-qwen-enabled";
let worker;
let sequence = 0;

export function localModelEnabled() {
  return localStorage.getItem(preference) === "true";
}

export function localModelSupported() {
  return typeof Worker === "function" && typeof WebAssembly === "object";
}

function request(prompt, signal, onDownload, options) {
  signal.throwIfAborted();
  worker ??= new Worker(new URL("./local-model-worker.js", import.meta.url), {
    type: "module",
    name: "Portfolio language model",
  });
  const active = worker;
  const id = ++sequence;
  return new Promise((resolve, reject) => {
    function cleanup() {
      clearTimeout(timer);
      signal.removeEventListener("abort", abort);
      active.removeEventListener("message", receive);
      active.removeEventListener("error", fail);
    }
    function fail(error) {
      cleanup();
      active.terminate();
      if (worker === active) worker = null;
      reject(
        error instanceof Error
          ? error
          : new Error("The local model could not start on this device."),
      );
    }
    function abort() {
      fail(signal.reason);
    }
    function receive({ data }) {
      if (data.id !== id) return;
      if (typeof data.progress === "number") {
        onDownload(data.progress);
        return;
      }
      if (data.error) {
        fail(new Error(data.error));
        return;
      }
      cleanup();
      resolve(data.result);
    }
    const timer = setTimeout(
      () =>
        fail(new Error("The local model took too long to load or respond.")),
      300000,
    );
    signal.addEventListener("abort", abort, { once: true });
    active.addEventListener("message", receive);
    active.addEventListener("error", fail);
    active.postMessage({
      id,
      prompt,
      maxTokens: options?.maxTokens,
      prefix: options?.prefix,
      choices: options?.choices,
    });
  });
}

export async function enableLocalModel(signal, onDownload) {
  await request(null, signal, onDownload);
  localStorage.setItem(preference, "true");
}

export function localModel(signal, onDownload) {
  return {
    prompt: (prompt, options) => request(prompt, signal, onDownload, options),
  };
}
