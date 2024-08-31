import type Sha1Noble from "@noble/hashes/sha1"
import { BytesOrCopiable, Copied } from "libs/copiable/index.js"
import { Adapter, Output } from "./adapter.js"

export function fromNoble(noble: typeof Sha1Noble) {
  const { sha1 } = noble

  function getBytes(bytes: BytesOrCopiable) {
    return "bytes" in bytes ? bytes.bytes : bytes
  }

  class Hasher {

    constructor(
      readonly inner: ReturnType<typeof Sha1Noble.sha1.create>
    ) { }

    [Symbol.dispose]() { }

    static create(inner: ReturnType<typeof Sha1Noble.sha1.create>) {
      return new Hasher(inner)
    }

    static createOrThrow() {
      return new Hasher(sha1.create())
    }

    cloneOrThrow() {
      return new Hasher(this.inner.clone())
    }

    updateOrThrow(bytes: BytesOrCopiable) {
      this.inner.update(getBytes(bytes))

      return this
    }

    finalizeOrThrow() {
      return new Copied(this.inner.clone().digest() as Output)
    }

  }

  function hashOrThrow(bytes: BytesOrCopiable) {
    return new Copied(sha1(getBytes(bytes)) as Output)
  }

  return { Hasher, hashOrThrow } satisfies Adapter
}