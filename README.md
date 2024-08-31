# Sha1

SHA-1 adapter for WebAssembly and JS implementations

```bash
npm i @hazae41/sha1
```

[**Node Package 📦**](https://www.npmjs.com/package/@hazae41/sha1)

## Features

### Current features
- 100% TypeScript and ESM
- No external dependencies

## Getting started

### WebAssembly

```bash
npm i @hazae41/sha1.wasm
```

```typescript
import { Sha1 } from "@hazae41/sha1"
import { Sha1Wasm } from "@hazae41/sha1.wasm"

Sha1.set(await Sha1.fromWasm(Sha1Wasm))
```

### Noble (JavaScript)

```bash
npm i @noble/hashes
```

```typescript
import { Sha1 } from "@hazae41/sha1"
import * as Noble from "@noble/hashes"

Sha1.set(Sha1.fromNoble(Noble))
```

## Usage

### Direct

```tsx
using hashed: Copiable = Sha1.get().getOrThrow().hashOrThrow(new Uint8Array([1,2,3,4,5]))
const hashed2: Uint8Array = hashed.bytes.slice()
```

### Incremental

```tsx
using hasher: Sha1.Hasher = Sha1.get().getOrThrow().Hasher.createOrThrow()
hasher.updateOrThrow(new Uint8Array([1,2,3,4,5]))

using hashed: Copiable = hasher.finalizeOrThrow()
const hashed2: Uint8Array = hashed.bytes.slice()
```