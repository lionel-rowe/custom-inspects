# Custom Inspects [![JSR](https://jsr.io/badges/@li/custom-inspects)](https://jsr.io/@li/custom-inspects)

Some experiments with custom inspects for Deno/NodeJS console logging.

<!-- custom thumbnail - see https://github.com/asciinema/asciinema/issues/646 -->
[![asciicast](https://raw.githubusercontent.com/lionel-rowe/custom-inspects/main/img/asciinema-673372-modified.svg)](https://asciinema.org/a/673372)

## Usage

### Deno

```ts
import { patch, inspectBytes } from '@li/custom-inspects'

patch(Uint8Array.prototype, inspectBytes)

console.info(await Deno.readFile('./img/Example.jpg'))

// Uint8Array(25303) [
//   ## x0 x1 x2 x3 x4 x5 x6 x7 x8 x9 xa xb xc xd xe xf
//   0x ff d8 ff e0 00 10 4a 46 49 46 00 01 01 01 00 48 ......JFIF.....H
//   1x 00 48 00 00 ff fe 00 24 43 72 65 61 74 65 64 20 .H.....$Created
//   2x 62 79 20 43 65 6e 74 72 78 2c 20 63 72 6f 70 70 by Centrx, cropp
//   3x 65 64 20 62 79 20 4a 50 78 47 ff db 00 43 00 06 ed by JPxG...C..
//   4x 04 05 06 05 04 06 06 05 06 07 07 06 08 0a 10 0a ................
//   5x 0a 09 09 0a 14 0e 0f 0c 10 17 14 18 18 17 14 16 ................
//   6x 16 1a 1d 25 1f 1a 1b 23 1c 16 16 20 2c 20 23 26 ...%...#... , #&
//   7x 27 29 2a 29 19 1f 2d 30 2d 28 30 25 28 29 28 ff ')*)..-0-(0%()(.
//   ... 25175 more bytes
// ]
```

### NodeJS

```ts
import * as fs from 'node:fs/promises'
import { patch, inspectBytes } from '@li/custom-inspects'

patch(Uint8Array.prototype, inspectBytes)
patch(Buffer.prototype, inspectBytes)

console.info(await fs.readFile('./img/Example.jpg'))

// Buffer(25303) [
//   ...
// ]
```
