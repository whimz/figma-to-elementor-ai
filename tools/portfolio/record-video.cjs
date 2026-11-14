// Serves the video page and the design folder on localhost (same origin, so the canvas can be recorded),
// renders preview frames, then records the canvas to MP4 in real time.
// Usage: node record.cjs [frames]   — "frames" only saves preview stills.
const http = require('http');
const fs = require('fs');
const path = require('path');
const PROJECT_DIR = path.resolve(__dirname, "../..");
const { chromium } = require(process.env.PLAYWRIGHT_CORE || "playwright-core");
const DESIGN = path.join(PROJECT_DIR, "design");
const OUT = DESIGN + '/portfolio';
const types = { '.html': 'text/html', '.png': 'image/png', '.jpg': 'image/jpeg' };
const server = http.createServer((req, res) => {
	const url = decodeURIComponent(req.url.split('?')[0]);
	const file = url === '/' ? path.join(__dirname, 'video.html') : path.join(DESIGN, url);
	if (!path.resolve(file).startsWith(DESIGN) && !path.resolve(file).startsWith(path.resolve(__dirname))) return res.writeHead(403).end();
	fs.readFile(file, (err, data) => (err ? res.writeHead(404).end() : res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' }).end(data)));
});

server.listen(0, '127.0.0.1', async () => {
	const port = server.address().port;
	const browser = await chromium.launch({ channel: 'chrome' });
	const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, acceptDownloads: true });
	page.on('pageerror', (e) => console.log('page error', e.message));
	await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
	console.log(await page.evaluate(() => window.loadAll()));
	if (process.argv[2] === 'frames') {
		for (const t of [2, 8, 12, 18, 22, 28, 38, 46]) {
			await page.evaluate((tt) => window.drawAt(tt), t);
			await page.locator('canvas').screenshot({ path: `${OUT}/raw/frame-${t}.png` });
		}
		console.log('frames saved');
	} else {
		const [download] = await Promise.all([page.waitForEvent('download', { timeout: 120000 }), page.evaluate(() => window.record())]);
		await download.saveAs(OUT + '/process-video.mp4');
		console.log('saved', OUT + '/process-video.mp4', fs.statSync(OUT + '/process-video.mp4').size);
	}
	await browser.close();
	server.close();
});
