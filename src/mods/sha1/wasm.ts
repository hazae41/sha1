import { Box } from "@hazae41/box"
import type { Sha1Hasher, Sha1Wasm } from "@hazae41/sha1.wasm"
import { BytesOrCopiable, Copiable } from "libs/copiable/index.js"
import { Adapter, Output } from "./adapter.js"

export function fromWasm(wasm: typeof Sha1Wasm) {
  const { Memory, Sha1Hasher, sha1 } = wasm

  function getMemory(bytesOrCopiable: BytesOrCopiable) {
    if (bytesOrCopiable instanceof Memory)
      return Box.createAsMoved(bytesOrCopiable)
    if (bytesOrCopiable instanceof Uint8Array)
      return Box.create(new Memory(bytesOrCopiable))
    return Box.create(new Memory(bytesOrCopiable.bytes))
  }

  class Hasher {

    constructor(
      readonly inner: Sha1Hasher
    ) { }

    [Symbol.dispose]() {
      using _ = this.inner
    }

    static new(inner: Sha1Hasher) {
      return new Hasher(inner)
    }

    static createOrThrow() {
      return new Hasher(new Sha1Hasher())
    }

    cloneOrThrow() {
      return new Hasher(this.inner.clone())
    }

    updateOrThrow(bytes: BytesOrCopiable) {
      using memory = getMemory(bytes)

      this.inner.update(memory.inner)

      return this
    }

    finalizeOrThrow() {
      return this.inner.finalize() as Copiable<Output>
    }

  }

  function hashOrThrow(bytes: BytesOrCopiable) {
    using memory = getMemory(bytes)

    return sha1(memory.inner) as Copiable<Output>
  }

  return { Hasher, hashOrThrow } satisfies Adapter
}