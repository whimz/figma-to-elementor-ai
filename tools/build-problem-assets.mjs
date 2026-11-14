// Builds the assets of the Home "We See your Problem" section (Figma node 1:2202):
// - world-map-dots.svg: the kit's dotted map as vector dots, 10% black as in the design;
// - card-mesh.svg: the dark cards' polygon mesh, turned 90° as in the design (background of the
//   global class card--dark, stretched to the card width);
// - icon-*.svg: the three feature icons in currentColor (colour set in Elementor), stroke icons
//   wrapped in fill="none" because the atomic SVG widget sets fill="currentColor" on the root.
// Inputs are Figma MCP downloads kept in design/figma/problem (not in git).
// Usage, from the project root:
//   node tools/build-problem-assets.mjs design/figma/problem design/assets
import fs from 'fs';
import path from 'path';
import { worldDots } from './lib/world-dots.mjs';

const [srcDir, outDir] = process.argv.slice(2);
const read = (name) => fs.readFileSync(path.join(srcDir, name), 'utf8');
const write = (file, svg) => {
	fs.writeFileSync(path.join(outDir, file), svg);
	console.log(`${file}: ${(svg.length / 1024).toFixed(1)} KB`);
};
const paths = (svg) => [...svg.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((m) => m[1]);

// Map: 718.55 px wide in the design.
const MAP_W = 718.55;
const dots = await worldDots(path.join(srcDir, 'map.png'), { x: 0, y: 0, w: MAP_W });
write(
	'home/world-map-dots.svg',
	`<svg xmlns="http://www.w3.org/2000/svg" width="${MAP_W}" height="${MAP_W / 2}" viewBox="0 0 ${MAP_W} ${MAP_W / 2}" fill="none" aria-hidden="true">`
		+ `<path d="${dots.d}" stroke="#000" stroke-opacity=".1" stroke-width="${dots.width}" stroke-linecap="round"/></svg>\n`
);

// Mesh: 1655.07 × 503.385 in Figma, shown rotated 90° clockwise.
const [meshW, meshH] = [1655.07, 503.385];
write(
	'global/card-mesh.svg',
	`<svg xmlns="http://www.w3.org/2000/svg" width="${meshH}" height="${meshW}" viewBox="0 0 ${meshH} ${meshW}" fill="none" aria-hidden="true">`
		+ `<path transform="translate(${meshH} 0) rotate(90)" d="${paths(read('mesh.svg'))[0]}" stroke="#B0B0B0" stroke-opacity=".2"/></svg>\n`
);

// Icons.
const icon = (file, out, { stroke }) => {
	const src = read(file);
	const viewBox = src.match(/viewBox="([^"]+)"/)[1];
	const [, , w, h] = viewBox.split(' ');
	const body = paths(src)
		.map((d) => (stroke ? `<path d="${d}"/>` : `<path d="${d}" fill="currentColor"/>`))
		.join('');
	const group = stroke
		? `<g fill="none" stroke="currentColor" stroke-width="1.57776" stroke-linecap="round" stroke-linejoin="round">${body}</g>`
		: body;
	write(out, `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${viewBox}" aria-hidden="true">${group}</svg>\n`);
};

icon('icon-nodes.svg', 'home/icon-vector-nodes.svg', { stroke: false });
icon('icon-database.svg', 'home/icon-database.svg', { stroke: true });
icon('icon-trending.svg', 'home/icon-trending-up.svg', { stroke: true });
