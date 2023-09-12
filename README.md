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

### Morax (WebAssembly)

```bash
npm i @hazae41/morax
```

```typescript
import { Sha1 } from "@hazae41/sha1"

Sha1.set(await Sha1.fromMorax())
```

### Noble (JavaScript)

```bash
npm i @noble/hashes
```

```typescript
import { Sha1 } from "@hazae41/sha1"

Sha1.set(Sha1.fromNoble())
```

## Usage

### Direct

```tsx
const hashed: Uint8Array = Sha1.get().tryHash(new Uint8Array([1,2,3,4,5])).unwrap().copy()
```

### Incremental

```tsx
const hasher = Sha1.get().Hasher.tryNew().unwrap()
hasher.tryUpdate(new Uint8Array([1,2,3,4,5])).unwrap()
const hashed: Uint8Array = hasher.tryFinalize().unwrap().copy()
```