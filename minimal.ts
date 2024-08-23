import * as colors from '@std/fmt/colors'
import { createCustomInspect } from './utils.ts'

export const inspectMinimal = createCustomInspect(
	function inspectMinimal(this: Intl.Locale & { [Symbol.toStringTag]?: unknown }, _, _options) {
		return colors.cyan(`${this[Symbol.toStringTag] ?? this.constructor.name} <${this.toString()}>`)
	},
)
