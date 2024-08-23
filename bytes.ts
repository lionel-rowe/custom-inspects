import * as colors from '@std/fmt/colors'
import { createCustomInspect } from './utils.ts'

export const inspectBytes = createCustomInspect(function inspectBytes(this: Uint8Array, _, options) {
	if (options.currentDepth > options.depth) {
		return `${colors.cyan(`[${this[Symbol.toStringTag]}]`)}`
	}

	const lines = debugBinary(this).split('\n')

	const out = `${this[Symbol.toStringTag]}(${this.length}) [${
		this.length
			? `\n${
				lines
					.map((x) => ' '.repeat(2) + x).join('\n')
			}\n`
			: ''
	}]`

	const outLines = out.split('\n')

	return [outLines[0], ...outLines.slice(1).map((x) => ' '.repeat(options.indentationLvl) + x)].join('\n')
})

type DebugBinaryOptions = {
	maxLines: number
	color: boolean
	caption: string
}

/** Based on hex editor display */
function debugBinary(bin: BufferSource, options?: Partial<DebugBinaryOptions>) {
	const lineLength = 16
	const maxLines = options?.maxLines ?? 8
	const caption = options?.caption ?? '##'
	const captionPadLength = Math.max(caption.length, 2)

	const u8 = new Uint8Array(ArrayBuffer.isView(bin) ? bin.buffer : bin)
	const o = Object.groupBy(
		[...u8],
		(_, i) => Math.floor(i / lineLength),
	)
	const lines: number[][] = Array.from({ length: Math.min(Object.keys(o).length, maxLines), ...o })

	const header = `${colors.dim(caption.padEnd(captionPadLength, ' '))} ${
		Array.from({ length: lineLength }, (_, i) => colors.dim('x') + colors.bold(i.toString(16))).join(' ')
	}`

	const out = [
		header,
		...lines.map((line, idx) => {
			const num = (idx * lineLength).toString(16).replace(/0$/, 'x')
				.padStart(2, '0')

			const offset = colors.dim('0'.repeat(captionPadLength - num.length)) +
				colors.bold(num.slice(0, -1)) + colors.dim(num.slice(-1))
			const hex = line.map((x) => x.toString(16).padStart(2, '0')).join(' ')
			const ascii = line.map((x) => x >= 0x20 && x <= 0x7e ? String.fromCodePoint(x) : colors.dim('.')).join('')

			return `${offset} ${
				colors.yellow(hex.padEnd(lineLength * 3 - 1))
					.replaceAll('00', colors.dim('00'))
			} ${colors.green(ascii)}`
		}),
	].join('\n')

	return u8.length > maxLines * lineLength ? `${out}\n... ${u8.length - maxLines * lineLength} more bytes` : out
}
