import { inspectBytes } from './bytes.ts'
import { patch } from './utils.ts'
import { exists } from '@std/fs'

patch(Uint8Array.prototype, inspectBytes)

const bins = [
	Uint8Array.from({ length: 1000 }, (_, i) => i),
	new TextEncoder().encode(
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
	),
	new TextEncoder().encode(
		'北冥有魚，其名曰鯤。鯤之大，不知其幾千里也。化而為鳥，其名為鵬。鵬之背，不知其幾千里也；怒而飛，其翼若垂天之雲。是鳥也，海運則將徙於南冥。南冥者，天池也。',
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
