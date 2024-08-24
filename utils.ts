import * as colors from '@std/fmt/colors'
import type { InspectOptions } from './types.ts'
import { inspectMinimal } from './minimal.ts'

function handleColor(options: InspectOptions) {
	const originalValue = colors.getColorEnabled()
	if (!options.colors) colors.setColorEnabled(false)

	return {
		[Symbol.dispose]() {
			colors.setColorEnabled(originalValue)
		},
	}
}

Deno.inspect

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

function getOptions(args: unknown[]): InspectOptions {
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

export function createCustomInspect<T>(fn: (this: T, options: InspectOptions) => string) {
	const inspect = function (this: T, ...args: unknown[]) {
		const options = getOptions(args)
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

export type CustomInspect<T> = ReturnType<typeof createCustomInspect<T>>

export function patch<T>(
	obj: T,
	customInspect: CustomInspect<T>,
) {
	for (
		const sym of [
			Symbol.for('Deno.customInspect'),
			Symbol.for('nodejs.util.inspect.custom'),
		]
	) {
		// @ts-expect-error custom inspect
		const oldVal = obj[sym]
		// @ts-expect-error custom inspect
		obj[sym] = customInspect

		return {
			[Symbol.dispose]() {
				// @ts-expect-error custom inspect
				obj[sym] = oldVal
			},
		}
	}
}
