// Builds the assets of the Home "Innovation" section (Figma node 1:2244):
// - decor-hexagons.svg: the honeycomb in the section's top-right corner (outline shapes filled
//   with a transparent-to-orange gradient), cleaned of Figma attributes;
// - innovation-chart.webp: the faint chart behind the third card, exported from Figma
//   (node 1:2270, get_screenshot) with its 30% opacity and 1px blur already applied.
// Inputs are Figma MCP downloads kept in design/figma/innovation (not in git).
// Usage, from the project root:
//   node tools/build-innovation-assets.mjs design/figma/innovation design/assets/home
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(path.join(process.cwd(), 'package.json'));
const sharp = require('sharp');

const [srcDir, outDir] = process.argv.slice(2);

const hex = fs.readFileSync(path.join(srcDir, 'hexagons.svg'), 'utf8');
const d = hex.match(/<path[^>]*\sd="([^"]+)"/)[1];
const gradient = hex.match(/<linearGradient[^>]*>[\s\S]*?<\/linearGradient>/)[0].replace(/id="[^"]+"/, 'id="hexagons-fade"');
const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="296" height="323" viewBox="0 0 296 323" fill="none" aria-hidden="true">'
	+ `<defs>${gradient.replace(/\s+/g, ' ')}</defs><path d="${d}" fill="url(#hexagons-fade)"/></svg>\n`;
fs.writeFileSync(path.join(outDir, 'decor-hexagons.svg'), svg);
console.log(`decor-hexagons.svg: ${(svg.length / 1024).toFixed(1)} KB`);

const info = await sharp(path.join(srcDir, 'chart-labels.png'))
	.webp({ quality: 90, alphaQuality: 100 })
	.toFile(path.join(outDir, 'innovation-chart.webp'));
console.log(`innovation-chart.webp: ${info.width} × ${info.height}, ${(info.size / 1024).toFixed(1)} KB`);
