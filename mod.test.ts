import { assertEquals } from '@std/assert'
import { inspectMinimal } from './minimal.ts'
import { inspectBytes } from './bytes.ts'
import { patch } from './utils.ts'

Deno.test(inspectMinimal.name, () => {
	using _ = patch(Intl.Locale.prototype, inspectMinimal)

	assertEquals(Deno.inspect(new Intl.Locale('en-US'), { colors: false }), 'Intl.Locale <en-US>')
	assertEquals(Deno.inspect(new Intl.Locale('en-US'), { colors: true }), '\x1b[36mIntl.Locale <en-US>\x1b[39m')
})

Deno.test(inspectBytes.name, async (t) => {
	using _ = patch(Uint8Array.prototype, inspectBytes)

	await t.step('lorem ipsum', () => {
		const bytes = new TextEncoder().encode(
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
		)

		assertEquals(
			Deno.inspect(bytes.slice(0, 10), { colors: false }),
			`
Uint8Array(10) [
  ## x0 x1 x2 x3 x4 x5 x6 x7 x8 x9 xa xb xc xd xe xf
  0x 4c 6f 72 65 6d 20 69 70 73 75                   Lorem ipsu
]
`.trim(),
		)

		assertEquals(
			Deno.inspect(bytes, { colors: false, iterableLimit: 10 }),
			`
Uint8Array(445) [
  ## x0 x1 x2 x3 x4 x5 x6 x7 x8 x9 xa xb xc xd xe xf
  0x 4c 6f 72 65 6d 20 69 70 73 75 6d 20 64 6f 6c 6f Lorem ipsum dolo
  ... 429 more bytes
]
`.trim(),
		)

		assertEquals(
			Deno.inspect(bytes, { colors: false }),
			`
Uint8Array(445) [
  ## x0 x1 x2 x3 x4 x5 x6 x7 x8 x9 xa xb xc xd xe xf
  0x 4c 6f 72 65 6d 20 69 70 73 75 6d 20 64 6f 6c 6f Lorem ipsum dolo
  1x 72 20 73 69 74 20 61 6d 65 74 2c 20 63 6f 6e 73 r sit amet, cons
  2x 65 63 74 65 74 75 72 20 61 64 69 70 69 73 63 69 ectetur adipisci
  3x 6e 67 20 65 6c 69 74 2c 20 73 65 64 20 64 6f 20 ng elit, sed do${' '}
  4x 65 69 75 73 6d 6f 64 20 74 65 6d 70 6f 72 20 69 eiusmod tempor i
  5x 6e 63 69 64 69 64 75 6e 74 20 75 74 20 6c 61 62 ncididunt ut lab
  6x 6f 72 65 20 65 74 20 64 6f 6c 6f 72 65 20 6d 61 ore et dolore ma
  ... 333 more bytes
]
`.trim(),
		)

		assertEquals(
			Deno.inspect(bytes, { colors: true }),
			`
Uint8Array(445) [
  \x1b[2m##\x1b[22m \x1b[2mx\x1b[22m\x1b[1m0\x1b[22m \x1b[2mx\x1b[22m\x1b[1m1\x1b[22m \x1b[2mx\x1b[22m\x1b[1m2\x1b[22m \x1b[2mx\x1b[22m\x1b[1m3\x1b[22m \x1b[2mx\x1b[22m\x1b[1m4\x1b[22m \x1b[2mx\x1b[22m\x1b[1m5\x1b[22m \x1b[2mx\x1b[22m\x1b[1m6\x1b[22m \x1b[2mx\x1b[22m\x1b[1m7\x1b[22m \x1b[2mx\x1b[22m\x1b[1m8\x1b[22m \x1b[2mx\x1b[22m\x1b[1m9\x1b[22m \x1b[2mx\x1b[22m\x1b[1ma\x1b[22m \x1b[2mx\x1b[22m\x1b[1mb\x1b[22m \x1b[2mx\x1b[22m\x1b[1mc\x1b[22m \x1b[2mx\x1b[22m\x1b[1md\x1b[22m \x1b[2mx\x1b[22m\x1b[1me\x1b[22m \x1b[2mx\x1b[22m\x1b[1mf\x1b[22m
  \x1b[2m\x1b[22m\x1b[1m0\x1b[22m\x1b[2mx\x1b[22m \x1b[33m4c 6f 72 65 6d 20 69 70 73 75 6d 20 64 6f 6c 6f\x1b[39m \x1b[32mLorem ipsum dolo\x1b[39m
  \x1b[2m\x1b[22m\x1b[1m1\x1b[22m\x1b[2mx\x1b[22m \x1b[33m72 20 73 69 74 20 61 6d 65 74 2c 20 63 6f 6e 73\x1b[39m \x1b[32mr sit amet, cons\x1b[39m
  \x1b[2m\x1b[22m\x1b[1m2\x1b[22m\x1b[2mx\x1b[22m \x1b[33m65 63 74 65 74 75 72 20 61 64 69 70 69 73 63 69\x1b[39m \x1b[32mectetur adipisci\x1b[39m
  \x1b[2m\x1b[22m\x1b[1m3\x1b[22m\x1b[2mx\x1b[22m \x1b[33m6e 67 20 65 6c 69 74 2c 20 73 65 64 20 64 6f 20\x1b[39m \x1b[32mng elit, sed do \x1b[39m
  \x1b[2m\x1b[22m\x1b[1m4\x1b[22m\x1b[2mx\x1b[22m \x1b[33m65 69 75 73 6d 6f 64 20 74 65 6d 70 6f 72 20 69\x1b[39m \x1b[32meiusmod tempor i\x1b[39m
  \x1b[2m\x1b[22m\x1b[1m5\x1b[22m\x1b[2mx\x1b[22m \x1b[33m6e 63 69 64 69 64 75 6e 74 20 75 74 20 6c 61 62\x1b[39m \x1b[32mncididunt ut lab\x1b[39m
  \x1b[2m\x1b[22m\x1b[1m6\x1b[22m\x1b[2mx\x1b[22m \x1b[33m6f 72 65 20 65 74 20 64 6f 6c 6f 72 65 20 6d 61\x1b[39m \x1b[32more et dolore ma\x1b[39m
  ... 333 more bytes
]
`.trim(),
		)
	})

	await t.step('utf-8 string', () => {
		const bytes = new TextEncoder().encode(
			'北冥有魚，其名曰鯤。鯤之大，不知其幾千里也。化而為鳥，其名為鵬。鵬之背，不知其幾千里也；怒而飛，其翼若垂天之雲。是鳥也，海運則將徙於南冥。南冥者，天池也。',
		)

		assertEquals(
			Deno.inspect(bytes, { colors: false }),
			`
Uint8Array(231) [
  ## x0 x1 x2 x3 x4 x5 x6 x7 x8 x9 xa xb xc xd xe xf
  0x e5 8c 97 e5 86 a5 e6 9c 89 e9 ad 9a ef bc 8c e5 ................
  1x 85 b6 e5 90 8d e6 9b b0 e9 af a4 e3 80 82 e9 af ................
  2x a4 e4 b9 8b e5 a4 a7 ef bc 8c e4 b8 8d e7 9f a5 ................
  3x e5 85 b6 e5 b9 be e5 8d 83 e9 87 8c e4 b9 9f e3 ................
  4x 80 82 e5 8c 96 e8 80 8c e7 82 ba e9 b3 a5 ef bc ................
  5x 8c e5 85 b6 e5 90 8d e7 82 ba e9 b5 ac e3 80 82 ................
  6x e9 b5 ac e4 b9 8b e8 83 8c ef bc 8c e4 b8 8d e7 ................
  ... 119 more bytes
]
`.trim(),
		)
	})

	await t.step('ascending bytes', () => {
		const bytes = Uint8Array.from({ length: 1000 }, (_, i) => i)

		assertEquals(
			Deno.inspect(bytes, { colors: false }),
			`
Uint8Array(1000) [
  ## x0 x1 x2 x3 x4 x5 x6 x7 x8 x9 xa xb xc xd xe xf
  0x 00 01 02 03 04 05 06 07 08 09 0a 0b 0c 0d 0e 0f ................
  1x 10 11 12 13 14 15 16 17 18 19 1a 1b 1c 1d 1e 1f ................
  2x 20 21 22 23 24 25 26 27 28 29 2a 2b 2c 2d 2e 2f  !"#$%&'()*+,-./
  3x 30 31 32 33 34 35 36 37 38 39 3a 3b 3c 3d 3e 3f 0123456789:;<=>?
  4x 40 41 42 43 44 45 46 47 48 49 4a 4b 4c 4d 4e 4f @ABCDEFGHIJKLMNO
  5x 50 51 52 53 54 55 56 57 58 59 5a 5b 5c 5d 5e 5f PQRSTUVWXYZ[\\]^_
  6x 60 61 62 63 64 65 66 67 68 69 6a 6b 6c 6d 6e 6f \`abcdefghijklmno
  ... 888 more bytes
]
`.trim(),
		)
	})

	await t.step('jpg file', async () => {
		const bytes = await Deno.readFile('./img/Example.jpg')

		assertEquals(
			Deno.inspect(bytes, { colors: false }),
			`
Uint8Array(25303) [
  ## x0 x1 x2 x3 x4 x5 x6 x7 x8 x9 xa xb xc xd xe xf
  0x ff d8 ff e0 00 10 4a 46 49 46 00 01 01 01 00 48 ......JFIF.....H
  1x 00 48 00 00 ff fe 00 24 43 72 65 61 74 65 64 20 .H.....$Created 
  2x 62 79 20 43 65 6e 74 72 78 2c 20 63 72 6f 70 70 by Centrx, cropp
  3x 65 64 20 62 79 20 4a 50 78 47 ff db 00 43 00 06 ed by JPxG...C..
  4x 04 05 06 05 04 06 06 05 06 07 07 06 08 0a 10 0a ................
  5x 0a 09 09 0a 14 0e 0f 0c 10 17 14 18 18 17 14 16 ................
  6x 16 1a 1d 25 1f 1a 1b 23 1c 16 16 20 2c 20 23 26 ...%...#... , #&
  ... 25191 more bytes
]
`.trim(),
		)
	})

	await t.step('png file', async () => {
		const bytes = await Deno.readFile('./img/Example.png')

		assertEquals(
			Deno.inspect(bytes, { colors: false }),
			`
Uint8Array(2335) [
  ## x0 x1 x2 x3 x4 x5 x6 x7 x8 x9 xa xb xc xd xe xf
  0x 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52 .PNG........IHDR
  1x 00 00 00 ac 00 00 00 b2 08 03 00 00 00 e8 33 d4 ..............3.
  2x 01 00 00 00 5d 50 4c 54 45 00 00 00 ff ff ff f6 ....]PLTE.......
  3x fd ec e5 c5 12 fb ce d1 f6 f8 fa b4 e8 f5 c9 e9 ................
  4x ee e7 f0 f0 c7 db d2 48 9c 72 5f 6c 65 75 82 7b .......H.r_leu.{
  5x b7 c6 be 89 9f 92 a1 b2 a7 d9 e7 dc 34 49 2e cf ............4I..
  6x e9 c2 c7 e2 a6 ad b6 6d f2 f0 b9 ed e2 80 e9 d3 .......m........
  ... 2223 more bytes
]
`.trim(),
		)
	})
})
