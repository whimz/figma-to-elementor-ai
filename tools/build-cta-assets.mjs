// Builds the mesh layer of the CTA strip (G3, Figma node 1:2407). The kit fills the frame with a
// stock picture (grey gradient + white wave mesh) through an image transform the MCP does not
// report. On the site the gradient is CSS (#fbfbfb → #eaeaea to the bottom right — fitted to the
// render, 0.5 grey levels off on average), and only the mesh is a picture on top of it:
// 1. Figma's own 2× render of the frame; the content (heading, divider, buttons) is painted out:
//    dark and purple pixels in the middle are masked (with a margin for anti-aliasing) and filled
//    from the surrounding background — the average of the row and column interpolation between the
//    nearest unmasked pixels, then smoothed;
// 2. the local background (a wide blur) is subtracted: what is lighter than it — the mesh with its
//    soft glow — is stored as white with alpha = (v − bg) / (255 − bg).
// The wave in the kit seems to be animated (every Figma render shows it in another position), so
// any frame is as good as the design; this one is the 2× export.
// Input: design/figma/cta/cta@2x.png — download_assets of 1:2407, png, scale 2 (not in git).
// Usage, from the project root:
//   node tools/build-cta-assets.mjs design/figma/cta design/assets/home
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const [srcDir, outDir] = process.argv.slice(2);
const { data, info } = await sharp(path.join(srcDir, 'cta@2x.png')).flatten({ background: '#fff' }).raw()
	.toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;

// Mask: only inside the content area (2×: x 560–2320, y 150–540), so the mesh stays untouched.
const box = { x1: 560, x2: 2320, y1: 150, y2: 540 };
let mask = new Uint8Array(W * H);
for (let y = box.y1; y < box.y2; y++) {
	for (let x = box.x1; x < box.x2; x++) {
		const i = (y * W + x) * C;
		const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
		const lum = 0.299 * r + 0.587 * g + 0.114 * b;
		if (lum < 222 || b - g > 6) {
			mask[y * W + x] = 1;
		}
	}
}

// Dilate by 8 px (2×) to cover anti-aliased edges and the button shadow.
const R = 8;
const grown = new Uint8Array(W * H);
for (let y = box.y1 - R; y < box.y2 + R; y++) {
	for (let x = box.x1 - R; x < box.x2 + R; x++) {
		let hit = 0;
		for (let dy = -R; dy <= R && !hit; dy++) {
			for (let dx = -R; dx <= R; dx++) {
				const yy = y + dy, xx = x + dx;
				if (yy >= 0 && yy < H && xx >= 0 && xx < W && mask[yy * W + xx]) { hit = 1; break; }
			}
		}
		grown[y * W + x] = hit;
	}
}
mask = grown;

// Fill: average of horizontal and vertical linear interpolation between the nearest clean pixels.
const out = Buffer.from(data);
const at = (x, y, c) => data[(y * W + x) * C + c];
for (let y = 0; y < H; y++) {
	for (let x = 0; x < W; x++) {
		if (!mask[y * W + x]) continue;
		let l = x, r = x, u = y, d = y;
		while (l > 0 && mask[y * W + l]) l--;
		while (r < W - 1 && mask[y * W + r]) r++;
		while (u > 0 && mask[u * W + x]) u--;
		while (d < H - 1 && mask[d * W + x]) d++;
		for (let c = 0; c < 3; c++) {
			const h = at(l, y, c) + (at(r, y, c) - at(l, y, c)) * ((x - l) / (r - l));
			const v = at(x, u, c) + (at(x, d, c) - at(x, u, c)) * ((y - u) / (d - u));
			out[(y * W + x) * C + c] = Math.round((h + v) / 2);
		}
	}
}

// Smooth the filled area a little (blurred copy blended in under the mask only).
const blurred = await sharp(out, { raw: info }).blur(6).raw().toBuffer();
for (let p = 0; p < W * H; p++) {
	if (!mask[p]) continue;
	for (let c = 0; c < 3; c++) out[p * C + c] = blurred[p * C + c];
}

// Local background: a wide blur (keeps the soft glow of the lines in the layer) on a mirrored
// margin (no bright bands at the edges). Differences under NOISE grey levels are pixel noise.
// The layer is 2560 px wide: WordPress keeps a wider upload but serves a re-encoded "-scaled" copy
// as "full". The render is scaled down before the layer is cut, so the alpha floor works at the
// final size (scaling the finished layer would multiply the alpha values and the file size).
const OUT_W = 2560;
const OW = OUT_W;
const OH = Math.round((H * OUT_W) / W);
const PAD = 86;
const SIGMA = 18;
const NOISE = 0.7;
// GAIN: line strength of the layer; tuned by eye against the frame (an argument when tuning).
const GAIN = Number(process.argv[4] ?? 2);
// Alpha under FLOOR (of 255) is the haze between the lines: dropped, it halves the file.
const FLOOR = 10;
// Every step ends in greyscale: given raw one-channel input, sharp otherwise outputs three
// channels, and the buffer is then read with a stride error (stripes across the layer).
const grey1 = async (pipeline, length) => {
	const buf = await pipeline.greyscale().raw().toBuffer();
	if (buf.length !== length) throw new Error(`expected ${length} bytes, got ${buf.length}`);
	return buf;
};
const raw1 = (width, height) => ({ raw: { width, height, channels: 1 } });
const grey = await grey1(sharp(out, { raw: info }).removeAlpha().resize(OW, OH).blur({ sigma: 0.6, precision: 'float' }), OW * OH);
// Two pipelines: within one, sharp would crop before extending.
const padded = await grey1(sharp(grey, raw1(OW, OH))
	.extend({ top: PAD, bottom: PAD, left: PAD, right: PAD, extendWith: 'mirror' })
	.blur({ sigma: SIGMA, precision: 'float' }), (OW + 2 * PAD) * (OH + 2 * PAD)); // integer blur drifts by ~2 levels
const local = await grey1(sharp(padded, raw1(OW + 2 * PAD, OH + 2 * PAD))
	.extract({ left: PAD, top: PAD, width: OW, height: OH }), OW * OH);
const mesh = Buffer.alloc(OW * OH * 4, 255);
for (let p = 0; p < OW * OH; p++) {
	const diff = grey[p] - local[p] - NOISE;
	const a = diff <= 0 ? 0 : Math.min(255, Math.round((GAIN * diff / (255 - local[p])) * 255));
	mesh[p * 4 + 3] = a < FLOOR ? 0 : a;
}

const file = path.join(outDir, 'cta-mesh.webp');
const meta = await sharp(mesh, { raw: { width: OW, height: OH, channels: 4 } })
	.webp({ quality: 90, alphaQuality: 100 }).toFile(file);
console.log(`cta-mesh.webp: ${meta.width} × ${meta.height}, ${(fs.statSync(file).size / 1024).toFixed(1)} KB`);
