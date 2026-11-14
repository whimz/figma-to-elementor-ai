# Work plan

Order agreed on 2026-10-03. The current stage is the first one with unchecked items.
The reasoning behind decisions is in [decisions.md](decisions.md).

---

## Stage 1. Context and repository ✅

- [x] `CLAUDE.md` — short context and rules for Claude.
- [x] `docs/context.md` — why the project exists (Upwork MCP, job-post analysis, goal).
- [x] `docs/decisions.md` — decisions and their rationale.
- [x] `docs/plan.md` — this plan.
- [x] `docs/workflow-log.md` — template for the AI process log.
- [x] `.gitignore`.
- [x] `git init` (branch `main`), first commit.

---

## Stage 2. Project skeleton and build (Gulp) ✅

- [x] `package.json`: `type: module`, `browserslist`, npm scripts:
  - `dev` — build + watch + browser-sync (proxy to http://localhost:8888, **port 3100**, UI on 3101: port 3000 is taken by a Docker container the user runs for other work);
  - `build` — production build (minified, no sourcemaps);
  - `zip` — archive of `theme/` for handing over to a client;
  - `wp:start` / `wp:stop` / `wp:cli` — wrappers around wp-env (replaced with Docker Compose in Stage 3, `wp:setup` added).
- [x] devDependencies (install current versions, check compatibility): `gulp` 5, `gulp-sass` + `sass`, `esbuild` (direct API call, no `gulp-esbuild` — D14), WebP and SVG tooling (D14), `gulp-postcss` + `autoprefixer`, `browser-sync`, `gulp-zip`, a cleanup utility (`del`), `@wordpress/env` (removed in Stage 3), `cross-env` (`NODE_ENV` in npm scripts on Windows).
- [x] `gulpfile.mjs`: tasks `styles`, `scripts`, `images` (raster → WebP, SVG stays vector — D14), `clean`, `watch`, `serve`, `build`, `zip`; the default task builds everything on start, then watches.
- [x] `src/`: `scss/` (tools/ — variables and mixins, base/, widgets/, `main.scss`), `js/` (modules/, `main.js`), `images/`.
- [x] `theme/` — child theme `ai-elem-child`:
  - `style.css` with the theme header (`Template: hello-elementor`);
  - `functions.php` — only includes the files from `inc/`;
  - `inc/setup.php` — theme supports, text domain;
  - `inc/enqueue.php` — enqueues `assets/`, versioned by `filemtime`;
  - `inc/elementor.php` — registers custom widgets from `widgets/` (hook `elementor/widgets/register`), own widget category;
  - `widgets/` — empty for now (README with a widget template);
  - `screenshot.png` — placeholder.
- [x] Folders `elementor/kit/`, `elementor/templates/`, `design/` (README with Figma links), `backups/`.
- [x] **Done when:** `npm run build` builds `theme/assets/`, `npm run zip` produces a theme archive without extra files. Checked 2026-10-16: prod and dev builds (sourcemaps only in dev), WebP and SVG on test files, archive `dist/ai-elem-child.zip` with the theme root folder, watch survives a SCSS error. The browser-sync proxy to the live site — to be checked in Stage 3.

---

## Stage 3. Local WordPress (Docker Compose) ✅

We started with wp-env and replaced it with our own docker-compose: WordPress files on drive D: were read ~150 times slower, a page took ~20 s (decisions.md, D5, update of 2026-10-16).

- [x] Docker Desktop (WSL2 backend) is running, `docker info` responds.
- [x] **Docker disk moved to D:** (`D:\Docker\DockerDesktopWSL`, 2026-10-05). The built-in move in Docker Desktop 4.91 fails because of a bug with the robocopy exit code — done manually, see decisions.md, D5. Images and volumes with WordPress and the database live there.
- [x] `docker-compose.yml` (project `ai-wp-elem`): MariaDB, WordPress on PHP 8.3 (core, plugins and uploads in a Docker volume), WP-CLI; only `theme/` is mounted from the project. `WP_ENVIRONMENT_TYPE=local`, errors are logged to `wp-content/debug.log` and not displayed.
- [x] `docker/`: `php.ini` (memory 512M, upload 64M), `setup.sh` (site install, safe to re-run), `wp-cli.yml`.
- [x] npm scripts: `wp:start`, `wp:stop`, `wp:setup`, `wp:cli` → http://localhost:8888 (admin / password).
- [x] The child theme is active, parent — Hello Elementor 3.5.1; plugins Elementor 4.3.5, SCF 6.9.6, Polylang 3.8.11 (stable releases from WordPress.org); Akismet and Hello Dolly removed.
- [x] Elementor 4.3.5: atomic elements and V4 are enabled by default; the Abilities API and the MCP adapter are in place, application passwords are available.
- [x] Basic WP settings: permalinks `/%postname%/`, timezone set, site language — English (the design and the portfolio are in English).
- [x] `npm run dev`: browser-sync on 3100 proxies the site; the live-reload script is injected into site pages but not into the admin, the login page or the Elementor editor preview.
- [x] **Done when:** the local site runs with the child theme and plugins, and the build output is picked up. Checked 2026-10-16: a page ~0.5 s, a WP-CLI command ~4 s, debug.log is empty.

---

## Stage 4. MCP servers ✅

Checked 2026-10-17; connection details — decisions.md, D16.

### Figma
- [x] `.mcp.json` in the root:
  ```json
  { "mcpServers": { "figma": { "type": "http", "url": "https://mcp.figma.com/mcp" } } }
  ```
- [x] Restart the Claude Code session, allow the servers from `.mcp.json`, complete OAuth via `/mcp` — **with an account in a paid Figma team** (its sandbox holds a copy of the design). Check that the account has a **Dev or Full** seat: only then is the limit ~200 calls a day (Starter / View / Collab get a handful a month). **2026-10-17:** a paid Figma team — Pro plan, Full seat (200 calls a day). VS Code never asked to allow the servers — they connected right after Reload Window.
- [x] Check: the agent reads a frame from a test Figma file. `get_metadata` on the sandbox file — one page "Page 1", Home frame `1:2084`.

### Elementor
- [x] Admin → Elementor → Elementor MCP → choose Claude Code → get the setup prompt (the application password is created automatically).
- [x] Add the server **only** with `--scope local` (the secret must not end up in the repository). Name `elementor`. Gotcha: VS Code runs the session under `d:\…` (lowercase drive letter), while `claude mcp add` from the terminal wrote the key `D:/…` — the server wasn't picked up. The entry is duplicated under `d:/…` (the user's decision, D16).
- [x] Restart the session, check the list of Elementor MCP tools. 20 tools: pages, compositions, targeted element edits, V4 global variables and classes, default styles, components, preview links. **No media upload** (only `list-assets`).
- [x] Check: the agent creates a test draft page with one section. The section (`e-flexbox` + `e-heading` + `e-paragraph`) was built with a single `build-composition` call, the `@media(--mobile)` styles applied; screenshots at 1440 / 768 / 375 via Playwright; the draft was moved to the trash.
- [x] Record in `workflow-log.md` what connected and how (down to the exact connection format — useful for client sites).

### Playwright (required)
Why: the agent opens pages itself, takes screenshots at three widths and compares them with the design **before** handing a section over for review (decisions.md, D13).
- [x] Add it to `.mcp.json` (no secrets — safe to commit). Final version: `cmd /c npx -y @playwright/mcp@0.0.83 --browser chrome --output-dir design/screens` (version pinned):
  ```json
  "playwright": { "command": "cmd", "args": ["/c", "npx", "@playwright/mcp@latest"] }
  ```
  `cmd /c` is a wrapper for npx servers on native Windows; if the server starts without it, `"command": "npx", "args": ["@playwright/mcp@latest"]` works too.
- [x] Browser: check whether the installed Chrome is picked up (yes, `--browser chrome`, nothing had to be downloaded); if not — `npx playwright install chromium`.
- [x] Log in to the local WordPress in the Playwright browser (admin / password) — Elementor drafts are visible only to logged-in users; the browser profile keeps the session.
- [x] Check: the agent opens http://localhost:8888, takes screenshots at the design width (desktop), 768 and 375, and saves them to `design/screens/` (the images don't go into git).

---

## Stage 5. Building from the design: assessment → foundation → section by section

Flow agreed on 2026-10-05 (decisions.md, D12). Preparation:

- [x] Design chosen: **General Website UI Kit** (Figma Community), pages **Home + Services + Contact**. The kit has no mobile version — we design it ourselves (decisions.md, D11). Details — [design/README.md](../design/README.md).
- [x] The kit was duplicated into a sandbox in a private paid Figma team (2026-10-05); see `design/README.md`.
- [x] The author (Sego) and the license (CC BY 4.0) are recorded in `design/README.md`.

### 5.1. Initial assessment of all designs (no building)

- [x] Read all three pages once via Figma MCP; save what was extracted to `design/` so calls aren't spent again. **2026-10-17:** 13 Figma calls; tokens — `design/tokens.md`, reference renders and per-section slices — `design/figma/ref/` (not in git).
- [x] Fill in the frame links in `design/README.md`.
- [x] `design/assessment.md` — the assessment report:
  - **design tokens:** colors/variables, typography (fonts, sizes, weights, line height), spacing scale, radii, shadows, container width and grid;
  - **section inventory** per page: what's inside, complexity (S/M/L), what repeats across pages (header, footer, CTA blocks, cards);
  - **mapping to Elementor:** which V4 global variables and classes we create, what is built from standard elements, where a custom widget is needed;
  - **Elementor Free limitations** and how we work around them (form, header/footer);
  - **assets:** images, icons, video — what to export;
  - **risks and questions**, the proposed build order.
- [x] `design/mobile-spec.md` — **general responsive rules**: breakpoints (Elementor defaults: tablet ≤1024, mobile ≤767), type and spacing scale per breakpoint, typical reflows (columns → stack, card grids), burger menu. Per-section details — in the 5.3 cycle.
- [x] `design/sections.md` — section tracker (filled in from the assessment results).
- [x] **The user's sign-off on the assessment.** 2026-10-17: all recommendations accepted, decisions — decisions.md, D17.

### 5.2. Foundation (before the first section)

- [x] Global styles in Elementor per `assessment.md`: 20 color variables + font, Default Styles h1–h4/p, 20 global classes (design/tokens.md, D18). Style guide — draft ID 59.
- [x] Header/footer: **our own mini Theme Builder** — Elementor templates output by the child theme (D17). Check first: MCP creates and edits a template, the theme outputs it with V4 styles, the burger runs on our JS. If that fails → the HFE plugin. **Check passed** (D18): parts `header`/`footer` (IDs 33/36) are placeholders, the design comes in cycles G1/G2.
- [x] Form: **Contact Form 7** (D17) — installed, the "Contact" form created, inserted as a classic Shortcode widget via the document API, submission checked via Mailpit (D18). Styles — in cycle C2.
- [x] Images: `npm run wp:import -- <file in design/assets>` (SVG — through the Elementor sanitizer, D18); imported the logo (46) and the polygon pattern (47).
- [x] Empty draft pages Home (48) / Services (49) / Contact (50); the "Primary" menu with 5 items in the Header location.
- [x] **The user's sign-off on the foundation.** Not recorded separately: the foundation was accepted de facto — Home was built and accepted on top of it (checked off 2026-11-01 with the user's consent).

### 5.3. Section-by-section build — a cycle for each section

Section order follows `sections.md` (usually: header/footer → Home → Services → Contact). For each section:

1. **Link** — the user gives a link to the section (Figma node) or says "next one in the tracker".
2. **Analysis** — structure and elements, which global styles/classes are used, what can be reused from finished work, tablet and mobile behavior (per the general rules in `mobile-spec.md`).
3. **Proposals** — how we build it (Elementor elements, whether a custom widget is needed), the concrete tablet and mobile layout, options and questions. Nothing is created.
4. **Start of work** — only after the user's "yes": build via Elementor MCP directly into the published page (this is a practice site, see CLAUDE.md; on client projects — into a draft).
5. **Review** — first a self-check via Playwright: screenshots of the section on desktop (design width), 768 and 375 next to the Figma frame, fix what's found; then hand it over to the user with screenshots against the checklist:
   - desktop matches the design (spacing, typography, colors);
   - tablet and mobile are as agreed in the proposal;
   - global styles and classes are used, no one-off hardcoded values without a reason;
   - everything is editable in Elementor (texts, images), no HTML widgets;
   - basic semantics and accessibility: heading hierarchy, image alt text, clear links and buttons, contrast;
   - images are optimized (WebP, reasonable sizes).
   Fixes — by prompts or by hand; after sign-off: status in `sections.md` → accepted, an entry in `workflow-log.md` (time, what the agent did, what was fixed by hand), export of the section to `elementor/templates/` if needed, a commit.

- [x] Header and footer (G1, G2 — accepted and published 2026-10-18; Home is the site's front page).
- [x] Home — all sections accepted (H1–H5, G6, G4, H8, H9, G3 — 2026-10-19).
- [x] Services — all sections accepted (2026-11-02).
- [x] Contact — all sections accepted, the form submits (2026-11-02).

### 5.4. Wrap-up

- [x] Export: the kit to `elementor/kit/`, templates to `elementor/templates/`, a DB dump to `backups/` (`wp db export`; mount `backups/` into the `cli` container). Done 2026-11-10: `npm run wp:export` (+ the V4 design system in `elementor/design-system/`, which the kit export lacks), dump — `npm run wp:backup` (D35). Repeated at the end of the stage (with the German version).
- [x] Summary in `workflow-log.md`: total time, the agent's share of the work, key takeaways for proposals (the "Stage 5 summary" section).
- [x] (optional) A custom widget that outputs SCF fields. Done 2026-11-10: the "Company Info" settings page and the Company Info widget — contacts in C2, C3 and the footer (D36).
- [x] (optional) A second language via Polylang. Done 2026-11-10: the German version `/de/` — copies of the three pages, the header and footer, menus, the form, a language switcher in the menu (D37).
- [x] **Done when:** the three pages match the design on desktop, tablet and mobile match the agreed proposals, everything is editable in Elementor, the form submits.

### 5.5. Polishing before the portfolio (the user's decisions of 2026-11-11)

- [x] The German version is accepted.
- [x] Update plugins: Contact Form 7 6.2.2 → 6.2.5, Polylang 3.8.11 → 3.9.2, SCF 6.9.6 → 6.9.8 — with a pixel-by-pixel check, as with Elementor (D38). Done 2026-11-11, 0 changes (D39).
- [x] Placeholders → real copy: lorem on Home / Services / Contact (93 places, 33 unique texts) and their German copies; the four testimonials get invented names, companies and distinct quotes. The style guide stays untouched.
  - Done 2026-11-13: 288 edits via MCP, checked at 7 widths (D40).
- [x] SEO: Yoast SEO Free, site name "Legite", titles, descriptions and preview images for all pages in both languages, noindex for utility pages (D41). Done 2026-11-13.
- [x] Video in H5: a stock clip with a free license, the `e-self-hosted-video` element (new in Elementor 4.4.0), the poster is the current placeholder. Done 2026-11-13: a Coverr clip (the license allows use on websites), starts on a button click, 0 changes in the snapshots before playback (D42).
- [x] About Us and the blog (post list and single post) from the kit: assessment → sign-off on the assessment → autonomous build (as in D32) → sign-off. Blog — templates in Site Parts + our own post-data widgets; demo posts; German versions (the page and post translations); "Reports & Guides" and "Technology" in the footer become blog categories; "Blogs" → "Blog".
  - 2026-11-14: assessment accepted (D44); About Us (306 / 327) and the blog (D45) built in both languages, accepted by the user 2026-11-14 (~150-word posts and the team's social icons are left as is).

---

## Stage 6. Show the result in the portfolio

Split of work (the user's decision of 2026-11-11): the user handles the subdomain and the site migration; screenshots, the process video and texts are the agent's job, after deployment.

- [x] Screenshots (desktop / mobile) and a short process video "design → agent → finished page". Done 2026-11-14 from the local site: gallery 01–06 and a 50 s video — `design/portfolio/`, scripts — `tools/portfolio/`, description — `docs/portfolio.md`. After the migration they can be re-shot from the subdomain.
- [ ] **Deployment rehearsal (the user):** moving the site from local Docker to a subdomain (migration, Elementor Replace URL, Regenerate CSS & Data, checks) — deployment practice + a public link. After the move — `wp yoast index` (Yoast doesn't build its index locally, D41).
- [x] Project text for the Upwork portfolio (task → what was done → result) and a line about the AI process for proposals. Done 2026-11-14 — `docs/portfolio.md` (only the subdomain URL is missing).
- [x] Before publishing the repository (GitHub): privacy review. Done 2026-11-15: this public repository is an English snapshot of the working repository, without its history and without personal notes.

---

## Open questions

- ~~Header/footer on Elementor Free — which option (Stage 5.2).~~ Our own mini Theme Builder, fallback — HFE (D17).
- ~~Form: Contact Form 7 or Fluent Forms (Stage 5.2).~~ Contact Form 7 (D17).
- ~~Image upload: via MCP or WP-CLI (Stage 5.2).~~ WP-CLI: Elementor MCP has no media upload (Stage 4).
- The exact procedure for connecting Elementor MCP to remote (client) sites — the format is the same (HTTP + Basic auth with an application password, D16); a live site needs HTTPS. To be checked on the first real staging site.
