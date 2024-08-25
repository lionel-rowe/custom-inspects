import * as colors from '@std/fmt/colors'
import type { InspectOptions } from './types.ts'

/**
 * @module
 * Utils for custom inspects for Deno/NodeJS console logging.
 */

function handleColor(options: InspectOptions) {
	const originalValue = colors.getColorEnabled()
	if (!options.colors) colors.setColorEnabled(false)

	return {
		[Symbol.dispose]() {
			colors.setColorEnabled(originalValue)
		},
	}
}

const defaultOptions: InspectOptions = {
	currentDepth: 0,
	depth: 4,
	indentationLvl: 0,
	colors: false,
	iterableLimit: 100,
} satisfies Record<string, string | number | boolean | bigint>

function getOption<K extends keyof InspectOptions>(o: Record<string, unknown>, key: K): InspectOptions[K] {
	// @ts-expect-error typeof
	return typeof o[key] === typeof defaultOptions[key] ? o[key] : defaultOptions[key]
}

function getAndNormalizeOptions(args: unknown[]): InspectOptions {
	const o = (args.find((x) => typeof x === 'object') ?? {}) as Record<string, unknown>

	const inspectOptions: InspectOptions = {
		currentDepth: getOption(o, 'currentDepth'),
		depth: getOption(o, 'depth'),
		indentationLvl: getOption(o, 'indentationLvl'),
		colors: getOption(o, 'colors'),
		iterableLimit: getOption(o, 'iterableLimit'),
	}

	return inspectOptions
}

/**
 * Creates a custom inspect function, adding error handling, handling of colors, and normalization of options.
 *
 * @param fn The function to create the custom inspect function from.
 * @returns The modified custom inspect function, which can be used with both Symbol.for('Deno.customInspect') and Symbol.for('nodejs.util.inspect.custom').
 */
export function createCustomInspect<T>(fn: (this: T, options: InspectOptions) => string): CustomInspect<T> {
	const inspect = function (this: T, ...args: unknown[]) {
		const options = getAndNormalizeOptions(args)
		using _ = handleColor(options)

		try {
			return fn.call(this, options)
		} catch {
			return colors.cyan(
				// @ts-expect-error name
				`${this[Symbol.toStringTag] ?? this.constructor.name ?? this.name} <[ failed to inspect ]>`,
			)
		}
	}
	Object.defineProperty(inspect, 'name', { value: fn.name })
	return inspect
}

/**
 * The custom inspect function type.
 */
export type CustomInspect<T> = (this: T, ...args: unknown[]) => string

/**
 * Monkey-patches the given object/prototype with the given custom inspect function.
 *
 * @param obj The object/prototype to patch
 * @param customInspect The custom inspect function to use
 * @returns A disposable object that can be used along with `using` to remove the patching once out of scope.
 *
 * @example Global patch
 * ```ts
 * import { patch } from '@li/custom-inspects'
 *
 * patch(Array.prototype, () => ':)')
 * console.log([])
 * // logs ":)"
 * ```
 *
 * @example Temporary patch with `using`
 * ```ts
 * import { patch } from '@li/custom-inspects'
 *
 * {
 * 	using _ = patch(Array.prototype, () => ':)')
 * 	console.log([])
 * 	// logs ":)"
 * }
 * console.log([])
 * // logs "[]"
 * ```
 */
export function patch<T>(
	obj: T,
	customInspect: CustomInspect<T>,
): {
	[Symbol.dispose](): void
} {
	const syms = [
		Symbol.for('Deno.customInspect'),
		Symbol.for('nodejs.util.inspect.custom'),
	]
	const oldVals: unknown[] = []

	for (const sym of syms) {
		// @ts-expect-error custom inspect
		oldVals.push(obj[sym])
		// @ts-expect-error custom inspect
		obj[sym] = customInspect
	}

	return {
		[Symbol.dispose]() {
			for (const [idx, sym] of syms.entries()) {
				// @ts-expect-error custom inspect
				obj[sym] = oldVals[idx]
			}
		},
	}
}
