// Builds the assets of "Applications That Drive Smarter Decisions" (H9, Figma node 1:2384):
// - features-grid.svg — the dashed sand grid behind the section (2 horizontal, 5 vertical lines),
//   drawn on the section's own box (1440 × 626) and stretched with it (preserveAspectRatio="none");
//   non-scaling strokes keep the 2 px lines and the 3.75 px dashes whatever the stretch;
// - features-chevrons.svg — seven chevrons fading to the right, mirrored as in the kit
//   (rotate 180° + flip Y = flip X);
// - features-icon-{menu,flag,crop}.svg — card icons, strokes in currentColor for e-svg
//   (the kit's menu icon has a fourth, white line: dropped).
// Grid geometry from get_design_context: layer "back" left 2.36% / right 1.74%, 658 high, centred
// 11.55 px above the middle; lines at 34.31% / 66.68% (horizontal, inset 4.09% / 4.13%) and at
// 19.37 / 34.70 / 49.98 / 65.26 / 80.54% (vertical, inset 1.82% / 1.86%); colour #FEDEAC at 34%.
// Inputs are Figma MCP downloads kept in design/figma/features (not in git).
// Usage, from the project root:
//   node tools/build-features-assets.mjs design/figma/features design/assets/home
import fs from 'fs';
import path from 'path';

const [srcDir, outDir] = process.argv.slice(2);
const read = (name) => fs.readFileSync(path.join(srcDir, name), 'utf8');
const write = (name, svg) => {
	fs.writeFileSync(path.join(outDir, name), svg);
	console.log(`${name}: ${(svg.length / 1024).toFixed(1)} KB`);
};
const r = (n) => Math.round(n * 100) / 100;

// Grid.
const W = 1440;
const H = 626;
const back = { left: W * 0.0236, width: W * (1 - 0.0236 - 0.0174), top: H / 2 - 11.55 - 329, height: 658 };
const hx1 = back.left + back.width * 0.0409;
const hx2 = back.left + back.width * (1 - 0.0413);
const vy1 = back.top + back.height * 0.0182;
const vy2 = back.top + back.height * (1 - 0.0186);
const lines = [
	...[0.3431, 0.6668].map((p) => `M${r(hx1)} ${r(back.top + back.height * p)}H${r(hx2)}`),
	...[0.1937, 0.347, 0.4998, 0.6526, 0.8054].map((p) => `M${r(back.left + back.width * p)} ${r(vy1)}V${r(vy2)}`),
];
write('features-grid.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" fill="none" aria-hidden="true">`
	+ '<g stroke="#FEDEAC" stroke-opacity="0.34" stroke-width="2" stroke-dasharray="3.75 3.75" stroke-dashoffset="1.875" vector-effect="non-scaling-stroke">'
	+ lines.map((d) => `<path d="${d}" vector-effect="non-scaling-stroke"/>`).join('')
	+ '</g></svg>\n');

// Chevrons: keep paths and gradients, mirror horizontally.
const pat = read('pat.svg');
const patW = Number(pat.match(/ width="([\d.]+)"/)[1]);
const patH = Number(pat.match(/ height="([\d.]+)"/)[1]);
const paths = [...pat.matchAll(/<path [^>]*\/>/g)].map((m) => m[0].replace(/ id="[^"]*"/, '').replace(/paint(\d)_linear_0_31/, 'chevron-fade-$1'));
const gradients = [...pat.matchAll(/<linearGradient[\s\S]*?<\/linearGradient>/g)]
	.map((m) => m[0].replace(/id="paint(\d)_linear_0_31"/, 'id="chevron-fade-$1"').replace(/\s+/g, ' '));
write('features-chevrons.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="${patW}" height="${patH}" viewBox="0 0 ${patW} ${patH}" fill="none" aria-hidden="true">`
	+ `<defs>${gradients.join('')}</defs>`
	+ `<g transform="matrix(-1 0 0 1 ${patW} 0)">${paths.join('')}</g></svg>\n`);

// Icons.
for (const name of ['menu', 'flag', 'crop']) {
	const icon = read(`icon-${name}.svg`);
	const d = [...icon.matchAll(/<path [^>]*?\sd="([^"]+)"[^>]*?\sstroke="([^"]+)"/g)]
		.filter((m) => m[2] !== 'white')
		.map((m) => `<path d="${m[1]}"/>`);
	write(`features-icon-${name}.svg`, '<svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" aria-hidden="true">'
		+ `<g fill="none" stroke="currentColor" stroke-width="2.41667" stroke-linecap="round" stroke-linejoin="round">${d.join('')}</g></svg>\n`);
}
