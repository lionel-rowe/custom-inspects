import { assertEquals } from '@std/assert'
import { inspectMinimal } from './minimal.ts'
import { inspectBytes } from './bytes.ts'
import { monkeyPatchCustomInspect } from './utils.ts'

Deno.test(inspectMinimal.name, () => {
	using _ = monkeyPatchCustomInspect(Intl.Locale, inspectMinimal)

	assertEquals(Deno.inspect(new Intl.Locale('en-US'), { colors: true }), '\x1b[36mIntl.Locale <en-US>\x1b[39m')
	assertEquals(Deno.inspect(new Intl.Locale('en-US'), { colors: false }), 'Intl.Locale <en-US>')
})

Deno.test(inspectBytes.name, () => {
	using _ = monkeyPatchCustomInspect(Uint8Array, inspectBytes)

	const bytes = new TextEncoder().encode(
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
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
  7x 67 6e 61 20 61 6c 69 71 75 61 2e 20 55 74 20 65 gna aliqua. Ut e
  ... 317 more bytes
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
  \x1b[2m\x1b[22m\x1b[1m7\x1b[22m\x1b[2mx\x1b[22m \x1b[33m67 6e 61 20 61 6c 69 71 75 61 2e 20 55 74 20 65\x1b[39m \x1b[32mgna aliqua. Ut e\x1b[39m
  ... 317 more bytes
]
`.trim(),
	)
})
