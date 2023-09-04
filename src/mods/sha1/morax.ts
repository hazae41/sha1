import type { Morax } from "@hazae41/morax"
import { Result } from "@hazae41/result"
import { Adapter } from "./sha1.js"

export function fromMorax(morax: typeof Morax): Adapter {

  class Hasher {

    constructor(
      readonly inner = new morax.Sha1Hasher()
    ) { }

    [Symbol.dispose]() {
      this.inner.free()
    }

    tryUpdate(bytes: Uint8Array) {
      return Result.runAndDoubleWrapSync(() => this.inner.update(bytes))
    }

    tryFinalize() {
      return Result.runAndDoubleWrapSync(() => this.inner.finalize())
    }

  }

  return { Hasher }
}