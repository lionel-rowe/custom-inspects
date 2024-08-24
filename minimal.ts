import * as colors from '@std/fmt/colors'
import { createCustomInspect } from './utils.ts'

export const inspectMinimal: (this: unknown, ...args: unknown[]) => string = createCustomInspect(
	function inspectMinimal(this: unknown, _options) {
		// @ts-expect-error name
		return colors.cyan(`${this[Symbol.toStringTag] ?? this.constructor.name ?? this.name} <${this.toString()}>`)
	},
)
