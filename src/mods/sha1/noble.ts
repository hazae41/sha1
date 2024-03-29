import { BytesOrCopiable, Copied } from "@hazae41/box"
import { Result } from "@hazae41/result"
import { sha1 } from "@noble/hashes/sha1"
import { Adapter, Output } from "./adapter.js"
import { CloneError, CreateError, FinalizeError, HashError, UpdateError } from "./errors.js"

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

    static createOrThrow() {
      return new Hasher(sha1.create())
    }

    static tryCreate() {
      return Result.runAndWrapSync(() => {
        return this.createOrThrow()
      }).mapErrSync(CreateError.from)
    }

    cloneOrThrow() {
      return new Hasher(this.inner.clone())
    }

    tryClone() {
      return Result.runAndWrapSync(() => {
        return this.cloneOrThrow()
      }).mapErrSync(CloneError.from)
    }

    updateOrThrow(bytes: BytesOrCopiable) {
      this.inner.update(getBytes(bytes))

      return this
    }

    tryUpdate(bytes: BytesOrCopiable) {
      return Result.runAndWrapSync(() => {
        return this.updateOrThrow(bytes)
      }).mapErrSync(UpdateError.from)
    }

    finalizeOrThrow() {
      return new Copied(this.inner.clone().digest() as Output)
    }

    tryFinalize() {
      return Result.runAndWrapSync(() => {
        return this.finalizeOrThrow()
      }).mapErrSync(FinalizeError.from)
    }

  }

  function hashOrThrow(bytes: BytesOrCopiable) {
    return new Copied(sha1(getBytes(bytes)) as Output)
  }

  function tryHash(bytes: BytesOrCopiable) {
    return Result.runAndWrapSync(() => {
      return hashOrThrow(bytes)
    }).mapErrSync(HashError.from)
  }

  return { Hasher, hashOrThrow, tryHash }
}