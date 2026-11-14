// Portfolio gallery (4:3, 2000 × 1500): HTML compositions of the raw screenshots, rendered by Chrome.
// Output: design/portfolio/01-cover.png … 06-languages.png
// Run after capture.cjs. Needs playwright-core (e.g. from the npx cache of @playwright/mcp; set PLAYWRIGHT_CORE to its path).
const path = require("path");
const PROJECT = path.resolve(__dirname, "../..");
const { chromium } = require(process.env.PLAYWRIGHT_CORE || "playwright-core");
const fs = require("fs");
const P = path.join(PROJECT, "design").split(path.sep).join("/");
const raw = (f) => `file:///${P}/portfolio/raw/${f}`;
const ref = (f) => `file:///${P}/figma/ref/${f}`;

const css = `
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700&display=swap');
*{box-sizing:border-box;margin:0}
body{width:1600px;height:1200px;overflow:hidden;font-family:Quicksand,sans-serif;color:#2d2d2d;
 background:radial-gradient(circle at 85% 15%,rgba(74,0,230,.14),transparent 45%),radial-gradient(circle at 10% 95%,rgba(253,176,72,.22),transparent 40%),#f7f7f7}
.label{position:absolute;font-weight:700;font-size:26px;letter-spacing:.02em;color:#4a00e6}
.kicker{position:absolute;left:80px;top:64px;font-weight:600;font-size:22px;color:#6d6d6d}
.title{position:absolute;left:80px;top:100px;font-weight:700;font-size:48px;line-height:58px;color:#2d2d2d}
.title strong{color:#4a00e6}.title em{font-style:normal;color:#cc7f0c}
.browser{position:absolute;border-radius:18px;overflow:hidden;background:#fff;box-shadow:0 30px 80px rgba(20,0,60,.18),0 0 0 1px rgba(0,0,0,.06)}
.browser .bar{height:40px;background:#efeff3;display:flex;align-items:center;gap:8px;padding:0 16px}
.browser .bar i{width:12px;height:12px;border-radius:50%;background:#d6d6dc;display:block}
.browser .bar span{margin-left:16px;flex:1;height:24px;border-radius:12px;background:#fff;font:600 13px/24px Quicksand,sans-serif;color:#888;padding:0 14px}
.browser .shot{display:block;width:100%;background-size:100% auto;background-repeat:no-repeat;background-position:top center}
.phone{position:absolute;border-radius:52px;padding:14px;background:#111;box-shadow:0 30px 80px rgba(20,0,60,.28)}
.phone .shot{display:block;border-radius:40px;background-size:100% auto;background-repeat:no-repeat;background-position:top center}
.caption{position:absolute;left:80px;bottom:56px;font-weight:600;font-size:22px;color:#6d6d6d}
`;
const browser = (x, y, w, img, url, h) => `<div class="browser" style="left:${x}px;top:${y}px;width:${w}px"><div class="bar"><i></i><i></i><i></i><span>${url}</span></div><div class="shot" style="height:${h || Math.round((w * 900) / 1440)}px;background-image:url('${img}')"></div></div>`;
const phone = (x, y, w, img) => `<div class="phone" style="left:${x}px;top:${y}px"><div class="shot" style="width:${w}px;height:${Math.round((w * 844) / 390)}px;background-image:url('${img}')"></div></div>`;

const scenes = {
	'01-cover': `
		<div class="kicker">Figma → WordPress · Elementor V4 · AI-first workflow</div>
		<div class="title"><strong>Crypto tax firm</strong> website,<br>built with <em>Claude Code</em> + Elementor MCP</div>
		${browser(80, 290, 1120, raw('desk-home-top.png'), 'legite / home')}
		${phone(1170, 330, 330, raw('mob-home-top.png'))}
		<div class="caption">6 pages · English + German · blog · fully editable in Elementor</div>`,
	'02-figma-vs-site': `
		<div class="label" style="left:80px;top:70px">Figma design</div>
		<div class="label" style="left:830px;top:70px">WordPress + Elementor V4</div>
		${browser(80, 120, 690, ref('home-1440.png'), 'figma · General Website UI Kit', 860)}
		${browser(830, 120, 690, raw('desk-home-full.png'), 'legite / home', 860)}
		<div class="caption">The design rebuilt section by section, checked against Figma at 1440, 768 and 375 px</div>`,
	'03-responsive': `
		<div class="label" style="left:80px;top:70px">Tablet and mobile layouts designed during the build — the kit is desktop-only</div>
		${phone(100, 150, 400, raw('mob-home-top.png'))}
		${phone(600, 150, 400, raw('mob-services-top.png'))}
		${phone(1100, 150, 400, raw('mob-blog-top.png'))}`,
	'04-blog': `
		<div class="label" style="left:80px;top:70px">Blog on Elementor Free: templates as site parts, custom data widgets</div>
		${browser(80, 130, 1080, raw('desk-blog-top.png'), 'legite / blog')}
		${phone(1150, 250, 330, raw('mob-article-top.png'))}
		<div class="caption">Search, categories, pagination · articles written in the WordPress block editor</div>`,
	'05-editor': `
		<div class="label" style="left:80px;top:70px">Everything stays editable in Elementor: V4 elements, global classes, named layers</div>
		${browser(80, 130, 1440, raw('editor-home.png'), 'wp-admin · Elementor', 900)}`,
	'06-languages': `
		<div class="label" style="left:80px;top:70px">English and German versions (Polylang), with translated forms, menus and SEO</div>
		${browser(80, 140, 980, raw('desk-home-top.png'), 'legite / en')}
		${browser(540, 470, 980, raw('desk-home-de-top.png'), 'legite / de')}`,
};

(async () => {
	const browserApp = await chromium.launch({ channel: 'chrome', args: ['--allow-file-access-from-files'] });
	const page = await browserApp.newPage({ viewport: { width: 1600, height: 1200 }, deviceScaleFactor: 1.25 });
	for (const [name, body] of Object.entries(scenes)) {
		const file = `${P}/portfolio/raw/_${name}.html`;
		fs.writeFileSync(file, `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${body}</body></html>`);
		await page.goto('file:///' + file, { waitUntil: 'networkidle' });
		await page.evaluate(() => document.fonts.ready);
		await page.waitForTimeout(500);
		await page.screenshot({ path: `${P}/portfolio/${name}.png` });
		fs.unlinkSync(file);
		console.log(name);
	}
	await browserApp.close();
})();
