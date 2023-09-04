import type { Morax } from "@hazae41/morax"
import { Result } from "@hazae41/result"
import { Adapter } from "./sha1.js"

export function fromMorax(morax: typeof Morax): Adapter {

  class Hasher {

    constructor(
      readonly inner: Morax.Sha1Hasher
    ) { }

    [Symbol.dispose]() {
      this.inner.free()
    }

    static new(inner: Morax.Sha1Hasher) {
      return new Hasher(inner)
    }

    static tryNew() {
      return Result.runAndDoubleWrapSync(() => new morax.Sha1Hasher()).mapSync(Hasher.new)
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