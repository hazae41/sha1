import type { sha1 } from "@noble/hashes/sha1"
import { Adapter } from "./sha1.js"

export function fromNoble(noble: typeof sha1): Adapter {

  class Hasher {
    readonly hash = noble.create()

    update(bytes: Uint8Array) {
      this.hash.update(bytes)
    }

    finalize() {
      return this.hash.clone().digest()
    }
  }

  return { Hasher }
}