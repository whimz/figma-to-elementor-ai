// Builds the avatar placeholder of the testimonials (G4, Figma node 1:2322): the kit's grey box
// (95 × 92, #E7E7E7) with the light silhouette (two ellipses), as one SVG.
// Rounded corners come from the Elementor class testimonial-avatar, so a client's photo gets
// the same shape. Silhouette position: from get_design_context (padding 10, inner box 87 wide
// with 6 px left padding, image insets −7.39% / −7.77%), i.e. at (3.57, −1.87) in the box.
// The head's drop shadow (y 4.29, blur σ 13.4, black 10%) is a radial gradient: the Elementor
// SVG sanitizer strips filter primitives, and an empty filter would hide the head.
// Inputs are Figma MCP downloads kept in design/figma/testimonials (not in git).
// Usage, from the project root:
//   node tools/build-testimonial-assets.mjs design/figma/testimonials design/assets/home
import fs from 'fs';
import path from 'path';

const [srcDir, outDir] = process.argv.slice(2);
const src = fs.readFileSync(path.join(srcDir, 'avatar.svg'), 'utf8');
const ellipses = [...src.matchAll(/<ellipse[^>]*\/>/g)].map((m) => m[0].replace(/ id="[^"]*"/, ''));
const attr = (el, name) => Number(el.match(new RegExp(` ${name}="([^"]+)"`))[1]);
const [body, head] = ellipses;

// Shadow of a disc blurred by a Gaussian: alpha(d) ≈ 0.1 × ½(1 − erf((d − R) / (σ√2))).
const erf = (x) => {
	const t = 1 / (1 + 0.3275911 * Math.abs(x));
	const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
	return x < 0 ? -y : y;
};
const R = (attr(head, 'rx') + attr(head, 'ry')) / 2;
const SIGMA = 13.4007;
const reach = R + 3 * SIGMA;
const stops = Array.from({ length: 9 }, (_, i) => {
	const d = (reach * i) / 8;
	const alpha = 0.1 * 0.5 * (1 - erf((d - R) / (SIGMA * Math.SQRT2)));
	return `<stop offset="${(i / 8).toFixed(3)}" stop-color="#000" stop-opacity="${alpha.toFixed(4)}"/>`;
}).join('');

const cx = attr(head, 'cx');
const cy = attr(head, 'cy') + 4.28822;
const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="95" height="92" viewBox="0 0 95 92" fill="none" aria-hidden="true">'
	+ `<defs><radialGradient id="avatar-shadow" cx="${cx}" cy="${cy.toFixed(4)}" r="${reach.toFixed(2)}" gradientUnits="userSpaceOnUse">${stops}</radialGradient></defs>`
	+ '<rect width="95" height="92" fill="#E7E7E7"/>'
	+ '<g transform="translate(3.57 -1.87)">'
	// The shadow lies over the body and under the head, as in the kit.
	+ `${body}<circle cx="${cx}" cy="${cy.toFixed(4)}" r="${reach.toFixed(2)}" fill="url(#avatar-shadow)"/>${head}`
	+ '</g></svg>\n';

fs.writeFileSync(path.join(outDir, 'avatar-placeholder.svg'), svg);
console.log(`avatar-placeholder.svg: ${(svg.length / 1024).toFixed(1)} KB`);
