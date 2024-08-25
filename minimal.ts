import * as colors from '@std/fmt/colors'
import { createCustomInspect } from './utils.ts'

/**
 * @module
 * Minimal custom inspects for Deno/NodeJS console logging.
 */

/**
 * Minimal custom inspect function that just prints the name of the object's constructor and its `toString()` value.
 */
export const inspectMinimal: (this: unknown, ...args: unknown[]) => string = createCustomInspect(
	function inspectMinimal(this: unknown, _options) {
		// @ts-expect-error name
		return colors.cyan(`${this[Symbol.toStringTag] ?? this.constructor.name ?? this.name} <${this.toString()}>`)
	},
)
