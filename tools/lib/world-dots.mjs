// Dotted world map from the UI kit, as vector dots.
// The kit's map is a 4096 × 2048 JPEG of uniform black dots (Figma shows it at 10–20% opacity);
// each dot is found as a connected dark area and written as a zero-length round-capped segment,
// so the whole map is one <path> (stroke-linecap="round", stroke-width = dot diameter).
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(path.join(process.cwd(), 'package.json'));
const sharp = require('sharp');

const r = (n) => Math.round(n * 100) / 100;
const r1 = (n) => Math.round(n * 10) / 10;

/**
 * @param {string} mapFile Path to the JPEG.
 * @param {{x: number, y: number, w: number}} box Where the map image sits in the SVG (its height is w / 2).
 * @returns {Promise<{d: string, width: number, count: number}>} Path data, dot diameter, number of dots.
 */
export async function worldDots(mapFile, box) {
	const { data, info } = await sharp(mapFile).greyscale().raw().toBuffer({ resolveWithObject: true });
	const W = info.width;
	const H = info.height;
	const seen = new Uint8Array(W * H);
	const scale = box.w / W;
	const parts = [];
	let size = 0;

	for (let y = 0; y < H; y++) {
		for (let x = 0; x < W; x++) {
			const i = y * W + x;
			if (seen[i] || data[i] > 128) continue;
			let n = 0, sx = 0, sy = 0, minx = x, maxx = x;
			const stack = [i];
			seen[i] = 1;
			while (stack.length) {
				const j = stack.pop();
				const jx = j % W;
				const jy = (j - jx) / W;
				n++; sx += jx; sy += jy;
				minx = Math.min(minx, jx); maxx = Math.max(maxx, jx);
				for (const k of [j - 1, j + 1, j - W, j + W]) {
					if (k < 0 || k >= W * H || seen[k] || data[k] > 128 || Math.abs((k % W) - jx) > 1) continue;
					seen[k] = 1;
					stack.push(k);
				}
			}
			size += maxx - minx + 1;
			parts.push(`M${r1(box.x + (sx / n + 0.5) * scale)} ${r1(box.y + (sy / n + 0.5) * scale)}h0`);
		}
	}

	return { d: parts.join(''), width: r((size / parts.length) * scale), count: parts.length };
}
