// Raw screenshots for the portfolio: full pages and first screens on desktop (1440) and phone (390 @2x),
// plus the Elementor editor of the home page. Output: design/portfolio/raw/ (not in git).
// Shared settings of the portfolio scripts. Override with environment variables, e.g. after the move to
// the subdomain: SITE_URL=https://demo.example.com WP_USER=… WP_PASS=… node tools/portfolio/capture.cjs
const path = require("path");
const PROJECT = path.resolve(__dirname, "../..");
const SITE = (process.env.SITE_URL || "http://localhost:8888").replace(/\/+$/, "");
const { chromium } = require(process.env.PLAYWRIGHT_CORE || "playwright-core");
const out = path.join(PROJECT, "design/portfolio/raw");
require("fs").mkdirSync(out, { recursive: true });
const pages = { home: '/', about: '/about-us/', services: '/services/', contact: '/contact/', blog: '/blog/', article: '/cost-basis-methods-explained/', 'home-de': '/de/', 'blog-de': '/de/ratgeber/' };
const settle = async (page) => {
	for (let y = 0; y < 14000; y += 500) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(80); }
	await page.evaluate(() => window.scrollTo(0, 0));
	await page.waitForTimeout(800);
};
(async () => {
	const browser = await chromium.launch({ channel: 'chrome' });
	for (const [device, opts] of [['desk', { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }], ['mob', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }]]) {
		const ctx = await browser.newContext({ ...opts, reducedMotion: 'reduce' });
		for (const [name, path] of Object.entries(pages)) {
			if (device === 'mob' && !['home', 'about', 'blog', 'article', 'services', 'contact'].includes(name)) continue;
			const page = await ctx.newPage();
			await page.goto(SITE + path, { waitUntil: 'networkidle' });
			await settle(page);
			await page.screenshot({ path: `${out}/${device}-${name}-top.png` });
			await page.screenshot({ path: `${out}/${device}-${name}-full.png`, fullPage: true });
			console.log(device, name);
			await page.close();
		}
		await ctx.close();
	}
	// The Elementor editor of the home page with the Structure panel, as a client would see it.
	const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
	const page = await ctx.newPage();
	await page.goto(SITE + '/wp-login.php');
	await page.fill('#user_login', process.env.WP_USER || 'admin');
	await page.fill('#user_pass', process.env.WP_PASS || 'password');
	await Promise.all([page.waitForNavigation(), page.click('#wp-submit')]);
	await page.goto(`${SITE}/wp-admin/post.php?post=48&action=elementor`);
	const frame = await (await page.waitForSelector('#elementor-preview-iframe', { timeout: 60000 })).contentFrame();
	await frame.waitForSelector('.elementor-element', { timeout: 60000 });
	await page.waitForTimeout(4000);
	// Select the hero heading so the panel shows real V4 settings.
	await frame.locator('h1').first().click();
	await page.waitForTimeout(2500);
	await page.screenshot({ path: `${out}/editor-home.png` });
	console.log('editor');
	await browser.close();
})();
