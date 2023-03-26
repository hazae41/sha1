export interface Hasher {
  update(bytes: Uint8Array): void
  finalize(): Uint8Array
}

export type HasherClass = new () => Hasher

export interface Adapter {
  Hasher: HasherClass
}

