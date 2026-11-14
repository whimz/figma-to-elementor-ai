// Builds the assets of the Contact page (Figma frame 1:2983):
// - contact-hero.webp — C1 photo: the visible fill of the 621 × 602 container (the kit stacks
//   four fills, the last one shows), cropped like "object-fit: cover", 2×;
// - contact-decor-pattern.webp — C2 decorative plate: the topographic pattern (1200 px tile, top
//   left) as the plate shows it — its 509 × 477 corner, white lines at 8% (Figma layer opacity);
//   transparent, so the plate colour stays in Elementor;
// - contact-map.webp — C3 map: the kit's Google Maps picture (640 × 640, the only size there is);
// - icon-{facebook,instagram,linkedin}.svg — social icons, strokes in currentColor, with a <title>
//   for screen readers (the icons are the links' only content);
// - icon-map-pin.svg — address marker, strokes in currentColor.
// Inputs are Figma MCP downloads kept in design/figma/contact (not in git).
// Usage, from the project root:
//   node tools/build-contact-assets.mjs design/figma/contact design/assets/contact
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const [srcDir, outDir] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const src = (file) => path.join(srcDir, file);
const out = (file) => path.join(outDir, file);
const report = (file) => console.log(`${file}: ${(fs.statSync(out(file)).size / 1024).toFixed(1)} KB`);

await sharp(src('hero-l3.img')).resize(1242, 1204, { fit: 'cover' }).webp({ quality: 80 }).toFile(out('contact-hero.webp'));
report('contact-hero.webp');

const { data, info } = await sharp(src('pattern.png')).extract({ left: 0, top: 0, width: 509, height: 477 })
	.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
for (let i = 0; i < data.length; i += 4) {
	data[i] = 255;
	data[i + 1] = 255;
	data[i + 2] = 255;
	data[i + 3] = Math.round(data[i + 3] * 0.08);
}
await sharp(data, { raw: info }).webp({ quality: 90, alphaQuality: 100 }).toFile(out('contact-decor-pattern.webp'));
report('contact-decor-pattern.webp');

await sharp(src('map.img')).webp({ quality: 85 }).toFile(out('contact-map.webp'));
report('contact-map.webp');

const strokeIcon = (file, name, title) => {
	const svg = fs.readFileSync(src(file), 'utf8');
	const paths = [...svg.matchAll(/<path [^>]*?\sd="([^"]+)"/g)].map((m) => `<path d="${m[1]}"/>`).join('');
	const titleTag = title ? `<title>${title}</title>` : '';
	const aria = title ? 'role="img"' : 'aria-hidden="true"';
	const result = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ${aria}>${titleTag}`
		+ `<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</g></svg>\n`;
	fs.writeFileSync(out(name), result);
	report(name);
};
strokeIcon('facebook.svg', 'icon-facebook.svg', 'Facebook');
strokeIcon('instagram.svg', 'icon-instagram.svg', 'Instagram');
strokeIcon('linkedin.svg', 'icon-linkedin.svg', 'LinkedIn');
strokeIcon('map-pin.svg', 'icon-map-pin.svg', null);
