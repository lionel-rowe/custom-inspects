import * as colors from '@std/fmt/colors'
import { createCustomInspect } from './utils.ts'
import { format } from '@std/fmt/bytes'

/**
 * @module
 * Custom inspects for Deno/NodeJS console logging of `Uint8Array` and NodeJs `Buffer` objects.
 */

/**
 * Custom inspect function for `Uint8Array` and NodeJs `Buffer` objects.
 *
 * @example
 * ```ts
 * import { patch } from '@li/custom-inspects/utils'
 * import { inspectBytes } from '@li/custom-inspects/bytes'
 *
 * patch(Uint8Array.prototype, inspectBytes)
 *
 * Deno.inspect(new TextEncoder().encode('Hello, 🌍!'))
 * // Uint8Array(12) [
 * //   ## x0 x1 x2 x3 x4 x5 x6 x7 x8 x9 xa xb xc xd xe xf
 * //   0x 48 65 6c 6c 6f 2c 20 f0 9f 8c 8d 21             Hello, ....!
 * // ]
 * ```
 */
export const inspectBytes: (this: Uint8Array, ...args: unknown[]) => string = createCustomInspect(
	function inspectBytes(this: Uint8Array, options) {
		if (options.currentDepth > options.depth) {
			return `${colors.cyan(`[${this.constructor.name}]`)}`
		}

		const prefix = `${this.constructor.name}(${this.length}) [`

		if (this.length === 0) return `${prefix}]`

		const innerIndent = ' '.repeat(options.indentationLvl + 2)

		return [
			prefix,
			...debugBinary(this, {
				radix: 16,
				maxLength: options.iterableLimit,
			}).map((x) => innerIndent + x),
			' '.repeat(options.indentationLvl) + ']',
		].join('\n')
	},
)

type DebugBinaryOptions = {
	radix: number
	maxLength: number
}

/** Based on hex editor display */
function debugBinary(bytes: Uint8Array, options: DebugBinaryOptions) {
	const { maxLength, radix } = options

	// We treat max length as more of a hint, as there's nothing to be gained from truncating the output
	// before the end of a complete line.
	const maxLines = Math.ceil(maxLength / radix)

	const actualLines = Math.min(maxLines, Math.ceil(bytes.length / radix))
	const maxCaptionLength = Math.max(2, (actualLines - 1).toString(radix).length + 1)
	const caption = '#'.repeat(maxCaptionLength)
	const captionPadLength = Math.max(caption.length, maxCaptionLength)

	const header = `${colors.dim(caption.padEnd(captionPadLength, ' '))} ${
		Array.from({ length: radix }, (_, i) => colors.dim('x') + colors.bold(i.toString(radix))).join(' ')
	}`

	const lines = [header]

	const numBytesToDisplay = Math.min(bytes.length, maxLines * radix)

	for (let startIdx = 0; startIdx < numBytesToDisplay; startIdx += radix) {
		const line = [...bytes.subarray(startIdx, startIdx + radix)]

		const lineIdx = Math.floor(startIdx / radix)
		const offset = (lineIdx * radix).toString(radix).padStart(maxCaptionLength, '0')

		const offsetMask = colors.dim('0'.repeat(Math.max(0, captionPadLength - offset.length))) +
			colors.bold(offset.slice(0, -1)) + colors.dim('x')
		const hexBytes = line.map((x) => x.toString(radix).padStart(2, '0')).join(' ')
		const ascii = line.map((x) => x >= 0x20 && x <= 0x7e ? String.fromCodePoint(x) : colors.dim('.')).join('')

		const formatted = `${offsetMask} ${
			colors.yellow(hexBytes.padEnd(radix * 3 - 1)).replaceAll('00', colors.dim('00'))
		} ${colors.green(ascii)}`

		lines.push(formatted)
	}

	if (bytes.length > maxLines * radix) {
		lines.push(`... ${format(bytes.length)} total`)
	}

	return lines
}
