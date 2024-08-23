import * as colors from '@std/fmt/colors'
import type { InspectOptions } from './types.ts'

function handleColor(options: InspectOptions) {
	const originalValue = colors.getColorEnabled()
	if (!options.colors) colors.setColorEnabled(false)

	return {
		[Symbol.dispose]() {
			colors.setColorEnabled(originalValue)
		},
	}
}

export function createCustomInspect<T>(fn: (this: T, _x: unknown, options: InspectOptions) => string) {
	const inspect = function (this: T, _x: unknown, options: InspectOptions) {
		using _ = handleColor(options)
		return fn.call(this, _x, options)
	}
	Object.defineProperty(inspect, 'name', { value: fn.name })
	return inspect
}

export type CustomInspect<T> = ReturnType<typeof createCustomInspect<T>>

// deno-lint-ignore no-explicit-any
export function monkeyPatchCustomInspect<T extends { new (...args: any[]): any }>(
	obj: T,
	customInspect: CustomInspect<InstanceType<T>>,
) {
	const oldVal = obj.prototype[Symbol.for('Deno.customInspect')]
	obj.prototype[Symbol.for('Deno.customInspect')] = customInspect

	return {
		[Symbol.dispose]() {
			obj.prototype[Symbol.for('Deno.customInspect')] = oldVal
		},
	}
}
