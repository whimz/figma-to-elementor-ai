// Builds the assets of the Home video section (Figma node 1:2287):
// - decor-diagonal-lines.svg: the thin orange lines on the left, cleaned of Figma attributes;
// - icon-play.svg: the play button icon in currentColor, stroke paths wrapped in fill="none"
//   (the atomic SVG widget sets fill="currentColor" on the root, D20).
// Inputs are Figma MCP downloads kept in design/figma/video (not in git).
// Usage, from the project root:
//   node tools/build-video-assets.mjs design/figma/video design/assets/home
import fs from 'fs';
import path from 'path';

const [srcDir, outDir] = process.argv.slice(2);
const read = (name) => fs.readFileSync(path.join(srcDir, name), 'utf8');
const paths = (svg) => [...svg.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((m) => m[1]);
const write = (file, svg) => {
	fs.writeFileSync(path.join(outDir, file), svg);
	console.log(`${file}: ${(svg.length / 1024).toFixed(1)} KB`);
};

const lines = read('lines.svg');
write(
	'decor-diagonal-lines.svg',
	'<svg xmlns="http://www.w3.org/2000/svg" width="639.4" height="758.1" viewBox="0 0 639.399 758.104" fill="none" aria-hidden="true">'
		+ `<g stroke="#FDB048">${paths(lines).map((d) => `<path d="${d}"/>`).join('')}</g></svg>\n`
);

const play = read('icon-play.svg');
write(
	'icon-play.svg',
	'<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">'
		+ '<g fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">'
		+ `${paths(play).map((d) => `<path d="${d}"/>`).join('')}</g></svg>\n`
);
