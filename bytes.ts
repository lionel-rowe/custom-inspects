import * as colors from '@std/fmt/colors'
import { createCustomInspect } from './utils.ts'

const LINE_LENGTH = 16

export const inspectBytes: (this: Uint8Array, ...args: unknown[]) => string = createCustomInspect(
	function inspectBytes(this: Uint8Array, options) {
		if (options.currentDepth > options.depth) {
			return `${colors.cyan(`[${this.constructor.name}]`)}`
		}

		const lines = debugBinary(this, {
			maxLines: Math.ceil(options.iterableLimit / LINE_LENGTH),
		}).split('\n')

		const out = `${this.constructor.name}(${this.length}) [${
			this.length
				? `\n${
					lines
						.map((x) => ' '.repeat(2) + x).join('\n')
				}\n`
				: ''
		}]`

		const outLines = out.split('\n')

		return [outLines[0], ...outLines.slice(1).map((x) => ' '.repeat(options.indentationLvl) + x)].join('\n')
	},
)

type DebugBinaryOptions = {
	maxLines: number
	color: boolean
	caption: string
}

/** Based on hex editor display */
function debugBinary(bytes: Uint8Array, options?: Partial<DebugBinaryOptions>) {
	const maxLines = options?.maxLines ?? 8
	const caption = options?.caption ?? '##'
	const captionPadLength = Math.max(caption.length, 2)

	const bytesTruncated = bytes.slice(0, Math.min(bytes.length, maxLines * LINE_LENGTH))
	const o = Object.groupBy([...bytesTruncated], (_, i) => Math.floor(i / LINE_LENGTH))

	const lines: number[][] = Array.from({ length: Math.min(Object.keys(o).length, maxLines), ...o })

	const header = `${colors.dim(caption.padEnd(captionPadLength, ' '))} ${
		Array.from({ length: LINE_LENGTH }, (_, i) => colors.dim('x') + colors.bold(i.toString(16))).join(' ')
	}`

	const out = [
		header,
		...lines.map((line, idx) => {
			const num = (idx * LINE_LENGTH).toString(16).replace(/0$/, 'x')
				.padStart(2, '0')

			const offset = colors.dim('0'.repeat(captionPadLength - num.length)) +
				colors.bold(num.slice(0, -1)) + colors.dim(num.slice(-1))
			const hex = line.map((x) => x.toString(16).padStart(2, '0')).join(' ')
			const ascii = line.map((x) => x >= 0x20 && x <= 0x7e ? String.fromCodePoint(x) : colors.dim('.')).join('')

			return `${offset} ${
				colors.yellow(hex.padEnd(LINE_LENGTH * 3 - 1))
					.replaceAll('00', colors.dim('00'))
			} ${colors.green(ascii)}`
		}),
	].join('\n')

	return bytes.length > maxLines * LINE_LENGTH
		? `${out}\n... ${bytes.length - maxLines * LINE_LENGTH} more bytes`
		: out
}
