export interface Hasher {
  update(bytes: Uint8Array): void
  finalize(): Uint8Array
}

export interface Adapter {
  Hasher: new () => Hasher
}

