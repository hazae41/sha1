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

```typescript
import { Sha1 } from "@hazae41/sha1"
import { Morax } from "@hazae41/morax"

await Morax.initBundledOnce()

/**
 * Create an instance from Morax
 **/
const sha1 = Sha1.fromMorax(Morax)

/**
 * Set it globally (optional)
 **/
Sha1.global.inner = sha1
```

### Noble (JavaScript)

```typescript
import { Sha1 } from "@hazae41/sha1"
import * as noble_sha1 from "@noble/hashes/sha1"

/**
 * Create an instance from Noble
 **/
const sha1 = Sha1.fromNoble(noble_sha1.sha1)

/**
 * Set it globally (optional)
 **/
Sha1.global.inner = sha1
```

## Usage

### Direct

```tsx
const hashed: Uint8Array = sha1.tryHash(new Uint8Array([1,2,3,4,5])).unwrap().copy()
```

### Incremental

```tsx
const hasher = sha1.Hasher.tryNew().unwrap()
hasher.tryUpdate(new Uint8Array([1,2,3,4,5])).unwrap()
const hashed: Uint8Array = hasher.tryFinalize().unwrap().copy()
```