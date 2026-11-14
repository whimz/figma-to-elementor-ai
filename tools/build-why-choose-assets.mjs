// Builds the assets of "Why you Choose us" (H8, Figma node 1:2333):
// - why-dash.svg — the dashed line under each point title (382 × 3.59, purple fading out);
//   preserveAspectRatio="none" lets it shrink with the column;
// - why-dot.svg — the timeline dot (the glow is a box-shadow in Elementor, the colour is currentColor);
// - why-trend.svg — the trend icon of the first point, strokes in currentColor (e-svg);
// - why-ai-engine.webp — the "AI Engine" chip, a raster in the kit (2220 px) → 640 px (2×);
// - why-chart.webp — the chart card, Figma PNG export at 2× (the SVG export carries canvas junk).
// Inputs are Figma MCP downloads kept in design/figma/why-choose (not in git).
// Usage, from the project root:
//   node tools/build-why-choose-assets.mjs design/figma/why-choose design/assets/home
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const [srcDir, outDir] = process.argv.slice(2);
const read = (name) => fs.readFileSync(path.join(srcDir, name), 'utf8');
const write = (name, svg) => {
	fs.writeFileSync(path.join(outDir, name), svg);
	console.log(`${name}: ${(svg.length / 1024).toFixed(1)} KB`);
};

// Dashed line: keep the path and the gradient, drop Figma's style and ids.
const dash = read('line3.svg');
const dashPath = dash.match(/ d="([^"]+)"/)[1];
const gradient = dash.match(/<linearGradient[\s\S]*?<\/linearGradient>/)[0]
	.replace(/id="[^"]+"/, 'id="why-dash-fade"')
	.replace(/\s+/g, ' ');
write('why-dash.svg', '<svg xmlns="http://www.w3.org/2000/svg" width="382" height="3.59" viewBox="0 0 382 3.59" preserveAspectRatio="none" fill="none" aria-hidden="true">'
	+ `<defs>${gradient}</defs>`
	+ `<path d="${dashPath}" stroke="url(#why-dash-fade)" stroke-width="3.59"/></svg>\n`);

write('why-dot.svg', '<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">'
	+ '<circle cx="17" cy="17" r="17" fill="currentColor"/></svg>\n');

// Trend icon: e-svg sets fill="currentColor" on the root, so the strokes sit in a fill="none" group.
const icon = read('icon.svg');
const iconPaths = [...icon.matchAll(/ d="([^"]+)"/g)].map((m) => `<path d="${m[1]}"/>`).join('');
write('why-trend.svg', '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120.244 120.244" aria-hidden="true">'
	+ `<g fill="none" stroke="currentColor" stroke-width="10.0203" stroke-linecap="round" stroke-linejoin="round">${iconPaths}</g></svg>\n`);

await sharp(path.join(srcDir, 'image5.png')).resize({ width: 640 }).webp({ quality: 86, alphaQuality: 90 })
	.toFile(path.join(outDir, 'why-ai-engine.webp'));
await sharp(path.join(srcDir, 'chart@2x.png')).webp({ quality: 90 })
	.toFile(path.join(outDir, 'why-chart.webp'));
for (const name of ['why-ai-engine.webp', 'why-chart.webp']) {
	const meta = await sharp(path.join(outDir, name)).metadata();
	console.log(`${name}: ${meta.width} × ${meta.height}, ${(fs.statSync(path.join(outDir, name)).size / 1024).toFixed(1)} KB`);
}
