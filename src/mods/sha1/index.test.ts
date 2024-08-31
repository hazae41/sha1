import "@hazae41/symbol-dispose-polyfill"

import { assert, test } from "@hazae41/phobos"
import { fromWasm } from "./morax.js"
import { fromNoble } from "./noble.js"

import { Sha1Wasm } from "@hazae41/sha1.wasm"
import * as Noble from "@noble/hashes/sha1"

test("direct", async ({ message }) => {
  const noble = fromNoble(Noble)
  using aaa = noble.hashOrThrow(new Uint8Array([1, 2, 3, 4, 5, 6]))

  const wasm = await fromWasm(Sha1Wasm)
  using bbb = wasm.hashOrThrow(new Uint8Array([1, 2, 3, 4, 5, 6]))

  assert(Buffer.from(aaa.bytes).equals(Buffer.from(bbb.bytes)))
})

test("incremental", async ({ message }) => {
  const noble = fromNoble(Noble)

  using nobleh = noble.Hasher.createOrThrow()
  nobleh.updateOrThrow(new Uint8Array([1, 2, 3, 4, 5, 6]))
  nobleh.updateOrThrow(new Uint8Array([1, 2, 3, 4, 5, 6]))

  using aaa = nobleh.finalizeOrThrow()

  const wasm = await fromWasm(Sha1Wasm)

  using wasmh = wasm.Hasher.createOrThrow()
  wasmh.updateOrThrow(new Uint8Array([1, 2, 3, 4, 5, 6]))
  wasmh.updateOrThrow(new Uint8Array([1, 2, 3, 4, 5, 6]))

  using bbb = wasmh.finalizeOrThrow()

  assert(Buffer.from(aaa.bytes).equals(Buffer.from(bbb.bytes)))
})