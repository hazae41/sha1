import { BytesOrCopiable, Copied } from "@hazae41/box"
import { Result } from "@hazae41/result"
import { sha1 } from "@noble/hashes/sha1"
import { Adapter } from "./adapter.js"
import { CreateError, FinalizeError, HashError, UpdateError } from "./errors.js"

export function fromNoble(): Adapter {

  function getBytes(bytes: BytesOrCopiable) {
    return "bytes" in bytes ? bytes.bytes : bytes
  }

  class Hasher {

    constructor(
      readonly inner: ReturnType<typeof sha1.create>
    ) { }

    [Symbol.dispose]() { }

    static new(inner: ReturnType<typeof sha1.create>) {
      return new Hasher(inner)
    }

    static tryNew() {
      return Result.runAndWrapSync(() => {
        return sha1.create()
      }).mapSync(Hasher.new).mapErrSync(CreateError.from)
    }

    tryUpdate(bytes: BytesOrCopiable) {
      return Result.runAndWrapSync(() => {
        return this.inner.update(getBytes(bytes))
      }).set(this).mapErrSync(UpdateError.from)
    }

    tryFinalize() {
      return Result.runAndWrapSync(() => {
        return this.inner.clone().digest()
      }).mapSync(Copied.new).mapErrSync(FinalizeError.from)
    }

  }

  function tryHash(bytes: BytesOrCopiable) {
    return Result.runAndWrapSync(() => {
      return sha1(getBytes(bytes))
    }).mapSync(Copied.new).mapErrSync(HashError.from)
  }

  return { Hasher, tryHash }
}