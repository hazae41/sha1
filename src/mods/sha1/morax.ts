import { Box, BytesOrCopiable, Copiable } from "@hazae41/box"
import { Morax } from "@hazae41/morax"
import { Result } from "@hazae41/result"
import { Adapter, Output } from "./adapter.js"
import { CloneError, CreateError, FinalizeError, HashError, UpdateError } from "./errors.js"

export async function fromMorax(): Promise<Adapter> {
  await Morax.initBundledOnce()

  function getMemory(bytesOrCopiable: BytesOrCopiable) {
    if (bytesOrCopiable instanceof Morax.Memory)
      return Box.greedy(bytesOrCopiable)
    if (bytesOrCopiable instanceof Uint8Array)
      return Box.new(new Morax.Memory(bytesOrCopiable))
    return Box.new(new Morax.Memory(bytesOrCopiable.bytes))
  }

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

    static createOrThrow() {
      return new Hasher(new Morax.Sha1Hasher())
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
      using memory = getMemory(bytes)

      this.inner.update(memory.inner)

      return this
    }

    tryUpdate(bytes: BytesOrCopiable) {
      return Result.runAndWrapSync(() => {
        return this.updateOrThrow(bytes)
      }).mapErrSync(UpdateError.from)
    }

    finalizeOrThrow() {
      return this.inner.finalize() as Copiable<Output>
    }

    tryFinalize() {
      return Result.runAndWrapSync(() => {
        return this.finalizeOrThrow()
      }).mapErrSync(FinalizeError.from)
    }

  }

  function hashOrThrow(bytes: BytesOrCopiable) {
    using memory = getMemory(bytes)

    return Morax.sha1(memory.inner) as Copiable<Output>
  }

  function tryHash(bytes: BytesOrCopiable) {
    return Result.runAndWrapSync(() => {
      return hashOrThrow(bytes)
    }).mapErrSync(HashError.from)
  }

  return { Hasher, hashOrThrow, tryHash }
}