import type { Morax } from "@hazae41/morax"
import { Result } from "@hazae41/result"
import { CreateError, FinalizeError, HashError, UpdateError } from "./error.js"
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
      return Result.runAndWrapSync(() => new morax.Sha1Hasher()).mapSync(Hasher.new).mapErrSync(CreateError.from)
    }

    tryUpdate(bytes: Uint8Array) {
      return Result.runAndWrapSync(() => this.inner.update(bytes)).mapErrSync(UpdateError.from)
    }

    tryFinalize() {
      return Result.runAndWrapSync(() => this.inner.finalize()).mapErrSync(FinalizeError.from)
    }

  }

  function tryHash(bytes: Uint8Array) {
    return Result.runAndWrapSync(() => morax.sha1(bytes)).mapErrSync(HashError.from)
  }

  return { Hasher, tryHash }
}