// Builds neutral placeholder logos for the Home "Trusted by" strip (Figma node 1:2194).
// The kit shows real trademarks (Webflow, Relume); a "trusted by" row must not suggest real
// endorsements, so the site uses invented marks until the client supplies partner logos.
// Each logo: a simple geometric mark + a generic word, set in an OFL font and converted to
// outlines (an SVG shown with <img> cannot load web fonts). 140 × 56, #C8C8C8 as in the design.
// Fonts (Google Fonts, OFL) are kept in design/assets/fonts-src (not in git).
// Usage, from the project root:
//   node tools/build-logo-placeholders.mjs design/assets/fonts-src design/assets/home
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(path.join(process.cwd(), 'package.json'));
const opentype = require('opentype.js');

const [fontDir, outDir] = process.argv.slice(2);
const W = 140;
const H = 56;
const COLOR = '#C8C8C8';
const MARK = 28; // Mark size; marks are drawn in 24 × 24 and scaled.
const GAP = 8; // Between the mark and the word.
const SIDE = 6; // Free space on each side of the tile.
const MAX_WORD_H = 22; // Tallest word glyph box, so condensed fonts do not grow too tall.
const r = (n) => Math.round(n * 100) / 100;

// Marks are drawn in a 24 × 24 box.
const marks = {
	ring: '<circle cx="12" cy="12" r="9.5" stroke-width="4" stroke="currentColor" fill="none"/>',
	diamond: '<rect x="5" y="5" width="14" height="14" rx="3" transform="rotate(45 12 12)"/><rect x="9.5" y="9.5" width="5" height="5" rx="1" transform="rotate(45 12 12)" fill="#fff"/>',
	triangle: '<path d="M12 2.5L22.5 21H1.5Z"/><path d="M12 11L16 18H8Z" fill="#fff"/>',
	hexagon: '<path d="M12 1.5L21.5 7V17L12 22.5L2.5 17V7Z"/><circle cx="12" cy="12" r="3.5" fill="#fff"/>',
	circles: '<circle cx="8.5" cy="12" r="7"/><circle cx="15.5" cy="12" r="7" fill-opacity=".55"/>',
};

const logos = [
	{ file: 'logo-placeholder-company.svg', word: 'Company', font: 'Poppins-SemiBold.ttf', mark: 'ring' },
	{ file: 'logo-placeholder-studio.svg', word: 'Studio', font: 'Righteous-Regular.ttf', mark: 'diamond' },
	{ file: 'logo-placeholder-brand.svg', word: 'BRAND', font: 'BebasNeue-Regular.ttf', mark: 'triangle' },
	{ file: 'logo-placeholder-agency.svg', word: 'Agency', font: 'DMSerifDisplay-Regular.ttf', mark: 'hexagon' },
	{ file: 'logo-placeholder-partner.svg', word: 'Partner', font: 'ArchivoBlack-Regular.ttf', mark: 'circles' },
];

for (const logo of logos) {
	const font = opentype.loadSync(path.join(fontDir, logo.font));
	// Size the word to fill the tile like the kit's logos: as wide as possible, within a height cap.
	const unit = font.getPath(logo.word, 0, 0, 100).getBoundingBox();
	const maxW = W - 2 * SIDE - MARK - GAP;
	const size = Math.min((maxW / (unit.x2 - unit.x1)) * 100, (MAX_WORD_H / (unit.y2 - unit.y1)) * 100);
	const probe = font.getPath(logo.word, 0, 0, size).getBoundingBox();
	const wordW = probe.x2 - probe.x1;
	const wordH = probe.y2 - probe.y1;
	const total = MARK + GAP + wordW;
	const left = (W - total) / 2;
	// Word centred vertically on its own glyph box, mark centred on the tile.
	const wordX = left + MARK + GAP - probe.x1;
	const wordY = (H - wordH) / 2 - probe.y1;
	const d = font.getPath(logo.word, wordX, wordY, size).toPathData(2);

	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="${COLOR}" color="${COLOR}">`
		+ `<g transform="translate(${r(left)} ${r((H - MARK) / 2)}) scale(${MARK / 24})">${marks[logo.mark]}</g>`
		+ `<path d="${d}"/>`
		+ '</svg>\n';

	fs.writeFileSync(path.join(outDir, logo.file), svg);
	console.log(`${logo.file}: word ${r(wordW)} × ${r(wordH)}, total ${r(total)} px, ${svg.length} B`);
}
