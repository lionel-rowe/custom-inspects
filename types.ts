/**
 * @module
 * Types for custom inspects for Deno/NodeJS console logging.
 */

/**
 * The options passed to custom inspect functions (options passed through to `Symbol.for('Deno.customInspect')` method
 * when an object is inspected. Partially modified from `lib.deno.ns.d.ts`)
 */
export type InspectOptions = {
	/** The current depth of the object being inspected. */
	currentDepth: number
	/** The current indentation level. 1 indentation level typically corresponds to 2 spaces. */
	indentationLvl: number
	/**
	 * Stylize output with ANSI colors.
	 * @default {false}
	 */
	colors: boolean
	/**
	 * Traversal depth for nested objects.
	 * @default {4}
	 */
	depth: number
	/**
	 * The maximum number of iterable entries to print.
	 * @default {100}
	 */
	iterableLimit: number
}
