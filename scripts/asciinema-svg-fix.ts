import { load } from 'cheerio'
import { assert } from '@std/assert'

let id = Deno.args[0]
let url = new URL(id.startsWith('https://') ? id : `https://null/${id}`)
id = url.pathname.split('/').at(-1)!.split('.').at(0)!
url = new URL(`https://asciinema.org/a/${id}.svg`)

const res = await fetch(url)
assert(res.ok, `Response status was ${res.status} ${res.statusText}`)
const $ = load(await res.text(), { xml: true })

const FONT_SIZE = 14
const CHAR_WIDTH = 0.6
const CELL_WIDTH = FONT_SIZE * CHAR_WIDTH

$('svg style').text(
	$('svg style').text().trim() + '\n\n' + `
	text {
		font-size-adjust: ch-width ${CHAR_WIDTH};
		font-variant-ligatures: none;
	}`.trim(),
)

const graphemeSegmenter = new Intl.Segmenter('en-US', { granularity: 'grapheme' })

for (const tspan of $('tspan')) {
	const $tspan = $(tspan)
	if ($tspan.children().length) continue

	const offset = parseFloat($tspan.attr('x') ?? '0')
	const text = $tspan.text().trim()
	$tspan.text(text)

	const xByGrapheme = [...graphemeSegmenter.segment(text)].map((_, i) => {
		return offset + (i * CELL_WIDTH)
	})

	$tspan.attr('x', xByGrapheme.map((x) => x.toFixed(1)).join(' '))
}

const outPath = `./img/asciinema-${id}-modified.svg`
await Deno.writeTextFile(outPath, $.xml().trim() + '\n')
console.log(`Wrote to ${outPath}`)
