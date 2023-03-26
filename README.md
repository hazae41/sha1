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

## Usage

### Morax (WebAssembly)

```typescript
import { Sha1 } from "@hazae41/sha1"
import { Morax } from "@hazae41/morax"

await Morax.initBundledOnce()
const sha1 = Sha1.fromMorax(Morax)
```

### Noble (JavaScript)

```typescript
import { Sha1 } from "@hazae41/sha1"
import * as noble_sha1 from "@noble/hashes/sha1"

const sha1 = Sha1.fromNoble(noble_sha1.sha1)
```
