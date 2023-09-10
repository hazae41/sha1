import { Result } from "@hazae41/result"
import type { sha1 } from "@noble/hashes/sha1"
import { CreateError, FinalizeError, HashError, UpdateError } from "./error.js"
import { Adapter, Copied } from "./sha1.js"

export function fromNoble(noble: typeof sha1): Adapter {

  class Hasher {

    constructor(
      readonly inner: ReturnType<typeof noble.create>
    ) { }

    [Symbol.dispose]() { }

    static new(inner: ReturnType<typeof noble.create>) {
      return new Hasher(inner)
    }

    static tryNew() {
      return Result.runAndWrapSync(() => noble.create()).mapSync(Hasher.new).mapErrSync(CreateError.from)
    }

    tryUpdate(bytes: Uint8Array) {
      return Result.runAndWrapSync(() => this.inner.update(bytes)).clear().mapErrSync(UpdateError.from)
    }

    tryFinalize() {
      return Result.runAndWrapSync(() => this.inner.clone().digest()).mapSync(Copied.new).mapErrSync(FinalizeError.from)
    }

  }

  function tryHash(bytes: Uint8Array) {
    return Result.runAndWrapSync(() => noble(bytes)).mapSync(Copied.new).mapErrSync(HashError.from)
  }

  return { Hasher, tryHash }
}