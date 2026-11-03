import { abortError } from "./errors.js";
const priorities = {
    visible: 0,
    adjacent: 1,
    background: 2,
};
export class RenderScheduler {
    #concurrency;
    #queue = [];
    #active = 0;
    #sequence = 0;
    constructor(concurrency) {
        this.#concurrency = Math.max(1, Math.trunc(concurrency));
    }
    get active() {
        return this.#active;
    }
    get queued() {
        return this.#queue.length;
    }
    run(priority, signal, task) {
        if (signal.aborted)
            return Promise.reject(abortError());
        return new Promise((resolve, reject) => {
            const queued = {
                priority: priorities[priority],
                sequence: this.#sequence++,
                signal,
                task,
                resolve,
                reject,
            };
            this.#queue.push(queued);
            this.#queue.sort((left, right) => left.priority - right.priority || left.sequence - right.sequence);
            const onAbort = () => {
                const index = this.#queue.indexOf(queued);
                if (index < 0)
                    return;
                this.#queue.splice(index, 1);
                reject(abortError());
            };
            signal.addEventListener("abort", onAbort, { once: true });
            void this.#drain();
        });
    }
    async #drain() {
        while (this.#active < this.#concurrency && this.#queue.length > 0) {
            const queued = this.#queue.shift();
            if (queued.signal.aborted) {
                queued.reject(abortError());
                continue;
            }
            this.#active += 1;
            void queued
                .task()
                .then(queued.resolve, queued.reject)
                .finally(() => {
                this.#active -= 1;
                void this.#drain();
            });
        }
    }
}
