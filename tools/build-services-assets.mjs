// Builds the assets of the Services page (Figma frame 1:2599):
// - services-hero-mesh.svg — S1 background: the kit's polygon mesh (2764 × 1327, #B0B0B0 at 20%),
//   flipped vertically as in Figma (rotate 180° + flip X), cropped to the part of the 1440 × 669 hero
//   frame below the 67 px navigation (the site's header is a separate part above the hero).
//   Placement from get_design_context: left −59.21% (−852.63 px), 1326.22 high, centred 99.68 px
//   below the middle of the frame;
// - services-insights-mesh.svg — background of the purple G6 variant: the same mesh as the Home
//   G6 (insights-mesh.svg), white at 20%, the whole 1440 × 809 section (x −57, y −53 in Figma);
// - services-feature-{1,2,3}.webp — S2–S4 photos: the visible fill of each 685 × 456 container,
//   cropped like "object-fit: cover", 2× (the kit stacks several fills, the last one shows);
// - faq-chevron.svg — the FAQ toggle icon, stroke in currentColor for e-svg.
// Inputs are Figma MCP downloads kept in design/figma/services and design/figma/insights (not in git).
// Usage, from the project root:
//   node tools/build-services-assets.mjs design/figma design/assets/services
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const [figmaDir, outDir] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const read = (file) => fs.readFileSync(path.join(figmaDir, file), 'utf8');
const pathOf = (svg) => svg.match(/<path[^>]*\sd="([^"]+)"/)[1];
const write = (name, svg) => {
	fs.writeFileSync(path.join(outDir, name), svg);
	console.log(`${name}: ${(svg.length / 1024).toFixed(1)} KB`);
};

// S1 mesh.
const HERO = { w: 1440, h: 669, nav: 67 };
const MESH = { left: -852.626, h: 1326.216, centre: HERO.h / 2 + 99.68 };
const top = MESH.centre - MESH.h / 2;
write('services-hero-mesh.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="${HERO.w}" height="${HERO.h - HERO.nav}" viewBox="0 ${HERO.nav} ${HERO.w} ${HERO.h - HERO.nav}" fill="none" aria-hidden="true">`
	+ `<path transform="matrix(1 0 0 -1 ${MESH.left} ${(top + MESH.h).toFixed(3)})" d="${pathOf(read('services/hero-mesh.svg'))}" stroke="#B0B0B0" stroke-opacity=".2"/></svg>\n`);

// G6 purple mesh.
write('services-insights-mesh.svg', '<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="809" viewBox="57 53 1440 809" fill="none" aria-hidden="true">'
	+ `<path d="${pathOf(read('insights/mesh.svg'))}" stroke="#fff" stroke-opacity=".2"/></svg>\n`);

// S2–S4 photos.
const photos = { 1: 'services/f1-layer4.png', 2: 'services/f2-raw8.img', 3: 'services/f3-raw10.img' };
for (const [n, file] of Object.entries(photos)) {
	const out = path.join(outDir, `services-feature-${n}.webp`);
	await sharp(path.join(figmaDir, file)).resize(1370, 912, { fit: 'cover' }).webp({ quality: 80 }).toFile(out);
	console.log(`services-feature-${n}.webp: ${(fs.statSync(out).size / 1024).toFixed(1)} KB`);
}

// FAQ chevron.
write('faq-chevron.svg', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">'
	+ '<path d="M6 9L12 15L18 9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>\n');
