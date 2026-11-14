// Builds the background of the "Insights" section (G6, Figma node 1:2303): the polygon mesh
// (same vector as pattern-mesh.svg, squeezed to 916 px high, 20% opacity) cropped to the part
// that is visible in the 1440 frame, so it can be a plain "100% auto, top center" background.
// In Figma the mesh is 1655 × 915 at x −57 (left −3.96%), y −353.89 (centred 300.89 px above
// the middle of the 809 px section); only its lower 561 px fall inside the section.
// Inputs are Figma MCP downloads kept in design/figma/insights (not in git).
// Usage, from the project root:
//   node tools/build-insights-assets.mjs design/figma/insights design/assets/home
import fs from 'fs';
import path from 'path';

const [srcDir, outDir] = process.argv.slice(2);
const src = fs.readFileSync(path.join(srcDir, 'mesh.svg'), 'utf8');
const d = src.match(/<path[^>]*\sd="([^"]+)"/)[1];

const X = 57;
const Y = 353.89;
const W = 1440;
const H = 915 - Y;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H.toFixed(2)}" viewBox="${X} ${Y} ${W} ${H.toFixed(2)}" fill="none" aria-hidden="true">`
	+ `<path d="${d}" stroke="#B0B0B0" stroke-opacity=".2"/></svg>\n`;

fs.writeFileSync(path.join(outDir, 'insights-mesh.svg'), svg);
console.log(`insights-mesh.svg: ${W} × ${H.toFixed(2)}, ${(svg.length / 1024).toFixed(1)} KB`);
