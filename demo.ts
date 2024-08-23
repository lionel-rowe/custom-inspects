import { inspectBytes } from './bytes.ts'
import { exists } from '@std/fs'

// @ts-expect-error custom inspect
Uint8Array.prototype[Symbol.for('Deno.customInspect')] = inspectBytes

const bins = [
	new TextEncoder().encode(
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
	),
]

const imgs = [
	// https://en.m.wikipedia.org/wiki/File:Example.png
	// public domain
	'https://upload.wikimedia.org/wikipedia/commons/7/70/Example.png',

	// https://en.wikipedia.org/wiki/File:Example.jpg
	// https://creativecommons.org/licenses/by-sa/3.0/
	'https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg',
]

for (const img of imgs) {
	const path = `./img/${encodeURIComponent(new URL(img).pathname.split('/').pop()!)}`

	let bytes: Uint8Array
	if (!await exists(path)) {
		bytes = await (await fetch(img)).bytes()
		await Deno.writeFile(path, bytes)
	} else {
		bytes = await Deno.readFile(path)
	}

	bins.push(bytes)
}

for (const bin of bins) {
	console.info('')
	console.info(bin)
}

console.info('')
