import type { Morax } from "@hazae41/morax"
import { Adapter } from "./sha1.js"

export function fromMorax(morax: typeof Morax): Adapter {
  const Hasher = morax.Sha1Hasher

  return { Hasher }
}