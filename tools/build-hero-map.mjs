// Builds the Home hero illustration (Figma node 1:2087) as one animated SVG:
// coordinate grid, the dotted world map vectorised from Figma's JPEG, office pins and routes
// with running dashes (CSS inside the SVG, off with prefers-reduced-motion).
// Inputs are Figma MCP downloads kept in design/figma/hero (not in git).
// Usage, from the project root:
//   node tools/build-hero-map.mjs design/figma/hero design/assets/home/hero-map.svg
// The result is placed with the atomic SVG widget (inline), not an image: an SVG in <img>
// does not see the page's prefers-reduced-motion. Ids and classes are prefixed (aiec-hm-)
// because inline SVG shares the page document.
import fs from 'fs';
import path from 'path';
import { worldDots } from './lib/world-dots.mjs';

const [srcDir, outFile] = process.argv.slice(2);
const read = (name) => fs.readFileSync(path.join(srcDir, name), 'utf8');
const r = (n) => Math.round(n * 100) / 100;

// Composite space = hero frame coords shifted by (372, 67): the grid starts at x 372,
// and the top 67 px sit under our sticky header (in Figma the 67 px nav overlaps the hero).
const OX = 372;
const OY = 67;
const PAT = { x: 736 - 12.513671875 - OX, y: 136 + 13 - OY, w: 1070.513671875, h: 535.2568359375 };
const CHART = { x: 736 - 364 - OX, y: 136 + 13 - 132 - OY, w: 1274.5860595703125, h: 611 };
const WIDTH = r(PAT.x + PAT.w);
const HEIGHT = r(PAT.y + PAT.h);


// --- Path helpers for Figma's dashed arcs (each dash is its own subpath). ---
function parseSubpaths(d) {
	const tokens = d.match(/[MLCHVZ]|-?\d*\.?\d+(?:e-?\d+)?/gi);
	const subs = [];
	let cur = null, cmd = null, pt = [0, 0];
	for (let i = 0; i < tokens.length;) {
		if (/[A-Z]/i.test(tokens[i])) cmd = tokens[i++];
		const num = () => parseFloat(tokens[i++]);
		if (cmd === 'M') {
			pt = [num(), num()];
			cur = { start: pt, segs: [] };
			subs.push(cur);
			cmd = 'L';
		} else if (cmd === 'L') {
			const p = [num(), num()];
			cur.segs.push({ type: 'L', from: pt, to: p });
			pt = p;
		} else if (cmd === 'H') {
			const p = [num(), pt[1]];
			cur.segs.push({ type: 'L', from: pt, to: p });
			pt = p;
		} else if (cmd === 'V') {
			const p = [pt[0], num()];
			cur.segs.push({ type: 'L', from: pt, to: p });
			pt = p;
		} else if (cmd === 'C') {
			const c1 = [num(), num()], c2 = [num(), num()], p = [num(), num()];
			cur.segs.push({ type: 'C', from: pt, c1, c2, to: p });
			pt = p;
		} else {
			throw new Error(`Unsupported command ${cmd}`);
		}
	}
	for (const s of subs) s.end = s.segs.length ? s.segs[s.segs.length - 1].to : s.start;
	return subs;
}

const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
// Cubic length ≈ mean of the chord and the control polygon (dashes are short and almost straight).
const segLen = (s) => (s.type === 'L' ? dist(s.from, s.to) : (dist(s.from, s.to) + dist(s.from, s.c1) + dist(s.c1, s.c2) + dist(s.c2, s.to)) / 2);

function reverseSub(s) {
	const segs = s.segs.slice().reverse().map((g) => (g.type === 'L' ? { type: 'L', from: g.to, to: g.from } : { type: 'C', from: g.to, c1: g.c2, c2: g.c1, to: g.from }));
	return { start: s.end, end: s.start, segs };
}

// Chain the dashes into one continuous curve (gaps become short straight lines).
function continuous(d) {
	const subs = parseSubpaths(d).filter((s) => s.segs.length);
	// Start from the dash whose nearest neighbour is farthest away: an end of the arc.
	const nearest = (p, pool) => Math.min(...pool.map((o) => Math.min(dist(p, o.start), dist(p, o.end))));
	let first = null, best = -1, firstFromEnd = false;
	for (const s of subs) {
		const others = subs.filter((o) => o !== s);
		for (const [p, fromEnd] of [[s.start, false], [s.end, true]]) {
			const n = nearest(p, others);
			if (n > best) { best = n; first = s; firstFromEnd = fromEnd; }
		}
	}
	// If the isolated point is the dash's end, reverse the dash so the chain starts there.
	const chain = [firstFromEnd ? reverseSub(first) : first];
	const pool = subs.filter((s) => s !== first);
	while (pool.length) {
		const tail = chain[chain.length - 1].end;
		let bi = 0, rev = false, bd = Infinity;
		pool.forEach((s, i) => {
			if (dist(tail, s.start) < bd) { bd = dist(tail, s.start); bi = i; rev = false; }
			if (dist(tail, s.end) < bd) { bd = dist(tail, s.end); bi = i; rev = true; }
		});
		const [s] = pool.splice(bi, 1);
		chain.push(rev ? reverseSub(s) : s);
	}
	const fmt = (p) => `${r(p[0])} ${r(p[1])}`;
	let out = `M${fmt(chain[0].start)}`;
	const dashes = [], gaps = [];
	chain.forEach((s, i) => {
		if (i) { out += `L${fmt(s.start)}`; gaps.push(dist(chain[i - 1].end, s.start)); }
		let len = 0;
		for (const g of s.segs) {
			out += g.type === 'L' ? `L${fmt(g.to)}` : `C${fmt(g.c1)} ${fmt(g.c2)} ${fmt(g.to)}`;
			len += segLen(g);
		}
		dashes.push(len);
	});
	const median = (a) => a.slice().sort((x, y) => x - y)[Math.floor(a.length / 2)];
	return { d: out, dash: r(median(dashes)), gap: r(median(gaps)) };
}

function svgParts(file) {
	const src = read(file);
	const attr = (name) => src.match(new RegExp(`<svg[^>]*\\s${name}="([^"]+)"`))[1];
	const d = src.match(/<path[^>]*\sd="([^"]+)"/)[1];
	const stroke = src.match(/<path[^>]*\sstroke="([^"]+)"/)[1];
	const defs = (src.match(/<defs>([\s\S]*?)<\/defs>/) || [, ''])[1].trim();
	return { width: parseFloat(attr('width')), height: parseFloat(attr('height')), viewBox: attr('viewBox'), d, stroke, defs };
}

// --- Arcs: positions from get_design_context (pin box + vector box + img insets). ---
const PIN = {
	p259: [259.513671875, 119], p885: [885.513671875, 165], p905: [905.513671875, 351],
	p338: [338.513671875, 305], p575: [575.513671875, 214],
};
const arcs = [
	{ file: 'arc416.svg', pin: 'p259', box: [11, -48.5, 105, 113.5], inset: [-0.86, -0.2, -0.29, -0.9] },
	{ file: 'arc419.svg', pin: 'p338', box: [13, -38.2451286315918, 234.5, 100.24512481689453], inset: [-1, 0, -0.57, -0.35] },
	{ file: 'arc420.svg', pin: 'p575', box: [14.5, -93, 173.5, 152.5], inset: [-0.66, 0, -0.15, -0.56] },
	{ file: 'arc421.svg', pin: 'p905', box: [-143, -230.5, 153.5, 311], inset: [-0.3, -0.65, 0, -0.25] },
	{ file: 'arc422.svg', pin: 'p885', box: [-296, 68.6732406616211, 307, 36.82676315307617], inset: [-2.72, 0, -2.47, -0.14] },
	{ file: 'arc423.svg', pin: 'p338', box: [-17.743083953857422, -246, 58.24308395385742, 307.5], inset: [-0.23, -1.19, -0.12, -1.72] },
	// Rotated arcs: outer box is the rotated bounding box, inner box is rotated around its centre.
	{ file: 'arc417.svg', pin: 'p259', outer: [-108.5, 2.89, 119.016, 105.695], inner: [55.266, 106.396], inset: [-0.92, -0.39, 0, -1.81], rotate: 124.38 },
	{ file: 'arc418.svg', pin: 'p259', outer: [-205, -21.55, 104.868, 85.67], inner: [31.696, 105.381], inset: [-0.74, -1.97, -0.36, -3.16], rotate: 124.38 },
];

const pins = [
	[259.513671875, 119, -7, 37], [753.513671875, 59, -3, 34], [885.513671875, 165, -3, 34],
	[905.513671875, 351, -3, 34], [141.513671875, 108, -8, 30], [43.513671875, 67, -3, 34],
	[338.513671875, 305, -3, 34], [575.513671875, 214, -3, 34], [367.513671875, 11, -3, 34],
];

const grid = (() => {
	const h = svgParts('grid-h.svg');
	const v = svgParts('grid-v.svg');
	const lines = [];
	for (const y of [285, 569]) {
		lines.push(`<svg x="${r(CHART.x - 311)}" y="${r(CHART.y + y - 0.5)}" width="1586" height="1" viewBox="0 0 1586 1" overflow="visible"><path d="${h.d}" stroke="#B0B0B0"/></svg>`);
	}
	for (const x of [218, 482, 746, 1010]) {
		lines.push(`<g transform="translate(${r(CHART.x + x)} ${r(CHART.y)}) rotate(90)"><svg y="-0.5" width="845" height="1" viewBox="0 0 845 1" overflow="visible"><path d="${v.d}" stroke="url(#aiec-hm-grid)"/></svg></g>`);
	}
	return `<g clip-path="url(#aiec-hm-clip)" opacity=".67">${lines.join('')}</g>`;
})();

const building = read('building.svg').match(/<g[^>]*>([\s\S]*?)<\/g>/)[1].replace(/\s(id)="[^"]*"/g, '').trim();

const dots = await worldDots(path.join(srcDir, 'map.png'), PAT);
const defs = [
	`<clipPath id="aiec-hm-clip"><rect x="${r(CHART.x)}" y="${r(CHART.y)}" width="${r(CHART.w)}" height="${CHART.h}"/></clipPath>`,
	'<linearGradient id="aiec-hm-grid" x1="0" y1="1" x2="845" y2="1" gradientUnits="userSpaceOnUse"><stop stop-color="#FEFEFE"/><stop offset=".446121" stop-color="#818181"/><stop offset="1" stop-color="#FEFEFE"/></linearGradient>',
	'<radialGradient id="aiec-hm-pin" cx=".529" cy=".471" r="1.309"><stop stop-color="#F7F7F7"/><stop offset="1" stop-color="#D1D1D1"/></radialGradient>',
];

const arcEls = arcs.map((a, i) => {
	const p = svgParts(a.file);
	const c = continuous(p.d);
	const [pinX, pinY] = PIN[a.pin];
	const [t, rr, b, l] = a.inset.map((v) => v / 100);
	let defsPart = p.defs;
	let stroke = p.stroke;
	if (defsPart) {
		const id = defsPart.match(/id="([^"]+)"/)[1];
		defsPart = defsPart.replace(`id="${id}"`, `id="aiec-hm-fade-${i}"`);
		stroke = `url(#aiec-hm-fade-${i})`;
	}
	// Figma dashes measure 3.9–4.1 on and off; one 4/4 pattern keeps every route on the same 8 px period.
	const pathEl = `<path class="aiec-hm-arc" d="${c.d}" stroke="${stroke}" stroke-width="2" stroke-linecap="round"/>`;
	if (!a.rotate) {
		const [bx, by, bw, bh] = a.box;
		const x = PAT.x + pinX + bx + l * bw;
		const y = PAT.y + pinY + by + t * bh;
		return `<svg x="${r(x)}" y="${r(y)}" width="${p.width}" height="${p.height}" viewBox="${p.viewBox}" overflow="visible">${defsPart ? `<defs>${defsPart}</defs>` : ''}${pathEl}</svg>`;
	}
	const [ox, oy, ow, oh] = a.outer;
	const [iw, ih] = a.inner;
	const cx = PAT.x + pinX + ox + ow / 2;
	const cy = PAT.y + pinY + oy + oh / 2;
	return `<g transform="translate(${r(cx)} ${r(cy)}) rotate(${a.rotate}) scale(1 -1) translate(${r(-iw / 2)} ${r(-ih / 2)})"><svg x="${r(l * iw)}" y="${r(t * ih)}" width="${p.width}" height="${p.height}" viewBox="${p.viewBox}" overflow="visible">${pathEl}</svg></g>`;
});

const pinEls = pins.map(([px, py, cx, cy], i) => {
	const x = PAT.x + px + cx;
	const y = PAT.y + py + cy;
	return `<g transform="translate(${r(x)} ${r(y)})">`
		+ `<circle class="aiec-hm-pulse" style="animation-delay:${r(i * 0.45)}s" cx="17" cy="17" r="16.5" stroke="#77408C"/>`
		+ '<circle cx="17" cy="17" r="16.5" fill="url(#aiec-hm-pin)" stroke="#77408C"/>'
		// Inline, not <use>: the Elementor editor strips <use> from SVG.
		+ `<g transform="translate(7 7)">${building}</g></g>`;
});

const style = [
	// A fixed offset of one period: a var() in the keyframe made Chrome jump instead of interpolating.
	'.aiec-hm-arc{stroke-dasharray:4 4;animation:aiec-hm-march .6s linear infinite}',
	'@keyframes aiec-hm-march{from{stroke-dashoffset:0}to{stroke-dashoffset:-8px}}',
	'.aiec-hm-pulse{fill:none;transform-box:fill-box;transform-origin:center;opacity:0;animation:aiec-hm-pulse 4s ease-out infinite}',
	'@keyframes aiec-hm-pulse{0%{opacity:.55;transform:scale(1)}60%,100%{opacity:0;transform:scale(1.9)}}',
	'@media (prefers-reduced-motion:reduce){.aiec-hm-arc,.aiec-hm-pulse{animation:none}}',
].join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" fill="none" aria-hidden="true">`
	+ `<!-- Hero world map (Figma 1:2087): grid, ${dots.count} dots, offices and routes. Dashes run along the routes; still with reduced motion. -->`
	+ `<style>${style}</style><defs>${defs.join('')}</defs>`
	// e-svg sets fill="currentColor" on the root: everything except the pins is stroke-only.
	+ '<g fill="none">' + grid
	+ `<path d="${dots.d}" stroke="#000" stroke-opacity=".2" stroke-width="${dots.width}" stroke-linecap="round"/>`
	+ `<g>${arcEls.join('')}</g></g>`
	+ `<g>${pinEls.join('')}</g>`
	+ '</svg>\n';

fs.writeFileSync(outFile, svg);
console.log(`${outFile}: ${WIDTH}x${HEIGHT}, ${dots.count} dots (d=${dots.width}), ${(svg.length / 1024).toFixed(1)} KB`);
arcs.forEach((a) => { const c = continuous(svgParts(a.file).d); console.log(a.file, 'dash', c.dash, 'gap', c.gap); });
