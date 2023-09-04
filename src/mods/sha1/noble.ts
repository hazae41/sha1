import { Result } from "@hazae41/result"
import type { sha1 } from "@noble/hashes/sha1"
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
      return Result.runAndDoubleWrapSync(() => noble.create()).mapSync(Hasher.new)
    }

    tryUpdate(bytes: Uint8Array) {
      return Result.runAndDoubleWrapSync(() => this.inner.update(bytes)).clear()
    }

    tryFinalize() {
      return Result.runAndDoubleWrapSync(() => this.inner.clone().digest()).mapSync(Copied.new)
    }

  }

  function tryHash(bytes: Uint8Array) {
    return Result.runAndDoubleWrapSync(() => noble(bytes)).mapSync(Copied.new)
  }

  return { Hasher, tryHash }
}