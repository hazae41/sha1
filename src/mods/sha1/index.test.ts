import { Morax } from "@hazae41/morax"
import { assert, test } from "@hazae41/phobos"
import * as noble_sha1 from "@noble/hashes/sha1"
import { fromMorax } from "./morax.js"
import { fromNoble } from "./noble.js"

test("direct", async ({ message }) => {
  const noble = fromNoble(noble_sha1.sha1)
  const aaa = noble.tryHash(new Uint8Array([1, 2, 3, 4, 5, 6])).unwrap().copy()

  await Morax.initBundledOnce()
  const morax = fromMorax(Morax)
  const bbb = morax.tryHash(new Uint8Array([1, 2, 3, 4, 5, 6])).unwrap().copy()

  assert(Buffer.from(aaa).equals(Buffer.from(bbb)))
})

test("incremental", async ({ message }) => {
  const noble = fromNoble(noble_sha1.sha1)
  const nobleh = noble.Hasher.tryNew().unwrap()
  nobleh.tryUpdate(new Uint8Array([1, 2, 3, 4, 5, 6])).unwrap()
  nobleh.tryUpdate(new Uint8Array([1, 2, 3, 4, 5, 6])).unwrap()
  const aaa = nobleh.tryFinalize().unwrap().copy()

  await Morax.initBundledOnce()
  const morax = fromMorax(Morax)
  const moraxh = morax.Hasher.tryNew().unwrap()
  moraxh.tryUpdate(new Uint8Array([1, 2, 3, 4, 5, 6])).unwrap()
  moraxh.tryUpdate(new Uint8Array([1, 2, 3, 4, 5, 6])).unwrap()
  const bbb = moraxh.tryFinalize().unwrap().copy()

  assert(Buffer.from(aaa).equals(Buffer.from(bbb)))
})