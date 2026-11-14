# Decisions and why we made them

Each decision is the outcome of discussions on 2026-10-02/03. When a decision changes, we add a new dated entry and keep the old one.

---

## D1. Why Elementor at all, if we can write our own theme

**Decision:** learn Elementor + AI as a separate line of work; custom themes from scratch remain a second tool.

**Why:**
- Elementor is chosen **for the client, not for the developer**: after handover the client wants to change texts, images and section order without a developer. Job posts say it outright: "so our team can edit text and images afterwards", "easy for a non-technical person to edit", "developer must set up global templates".
- A custom theme on SCF fields lets the client edit content in fixed blocks; Elementor also gives the freedom to change the layout. These are different products. If the client asks for Elementor (~2/3 of job posts), a custom theme can't replace it.
- The objection "working by hand in the Elementor editor is a waste of time, a custom theme is simpler" is answered by Elementor MCP (see D2): no manual building in the editor is needed.

**When to choose a custom theme:** the client needs a fast site for a fixed design without a page builder; the site is mostly dynamic (catalog, filters, CPTs — as in a previous classic-theme project); the client doesn't want to depend on Elementor.

---

## D2. How we work with Elementor: through Elementor MCP, not by hand

**Decision:** the main path is the official Elementor MCP (released 2026-09-23) + Figma MCP + Claude Code.

**What it looks like:**
1. The agent reads the design through Figma MCP (sections, spacing, colors, fonts, texts).
2. Through Elementor MCP it builds the page straight away with the content from the design — real Elementor elements, with global styles. It is saved as a draft.
3. A human checks it in the browser; fixes (spacing, responsiveness, layout) are also made with prompts.
4. We open the editor only for small visual tweaks and publishing.

The agency Webgate (an Elementor case study) puts it this way: "Use Codex or Claude for the heavy implementation work. Use Elementor for final visual tweaking".

**Connecting:** WordPress admin → Elementor → Elementor MCP → choose Claude Code → the plugin creates an application password itself and gives a setup prompt. Admins only; each site is connected separately. Basic features are free; Pro elements require Pro.

**Limitations and risks:**
- Works only with **atomic elements (V4)**; according to reviews, Elementor 4.3+ is needed. In the beta the atomic editor was enabled under Elementor → Settings → Atomic Editor → Activate — check whether this is still needed.
- The official MCP doesn't edit classic V3 pages (V3 and V4 can coexist on one site). For V3 there is the third-party Respira (€9/month, unofficial — on client sites only with the client's consent).
- Uploading images to the media library via MCP isn't guaranteed — locally it can be done via WP-CLI.
- The tool is ~10 days old: we check its real quality in practice and record it in `workflow-log.md`.

**Alternatives (if MCP doesn't fit):**
- JSON templates in Elementor's export format → Templates → Import (works for V3 too).
- Custom Elementor widgets in PHP (`\Elementor\Widget_Base`) — for complex blocks; the client edits the fields in the Elementor panel.
- ❌ We don't do: markup in the "HTML" widget — the client can't edit it, and it contradicts what job posts require.

---

## D3. Theme: a child of Hello Elementor, not our own from scratch

**Decision:** the parent theme Hello Elementor + our own child theme `ai-elem-child` (in the repository — the `theme/` folder).

**What Hello Elementor is:** the official minimalist theme from the Elementor developers (1M+ installs, v3.5.1 as of 2026-08). Minimal markup and reset, supports all Elementor features.

**Why Hello + child:**

| | Hello + child | Custom theme from scratch |
|---|---|---|
| Start | 3 files; working in Elementor on day one | Days on the basics: index/header/footer/page/single/archive/404/search, theme supports, reset, content width, "hide title", Theme Builder locations |
| Header/footer on Elementor Free | Out of the box (basic, via Site Settings) | Written in PHP — the client can't change them |
| Style conflicts | Minimal; Hello's CSS can be disabled in its settings | Risk of duplicating Elementor global styles with theme styles |
| Elementor V4 compatibility | Handled by the Elementor team | Our responsibility |
| Handover to the client | Familiar to any Elementor developer | The client depends on us |
| Portfolio | Shows Elementor + AI + custom widgets | Shows PHP — already covered by a previous classic-theme project |

- A child theme **doesn't limit us**: any template can go into it (`header.php`, `single-*.php`, `archive-*.php`) and override the parent's. A hybrid of "marketing pages in Elementor + catalog/CPTs in PHP with SCF" is possible inside the child theme.
- The project's goal is a new skill (Elementor + AI), not another classic theme.
- Correction: Hello is one of the most popular themes for Elementor, but not "most sites"; clients often have Astra, Kadence or commercial themes (job posts mentioned Industrium, Woodmart, Enfold, Zeen). The skill of working through a child theme carries over to any parent.

---

## D4. Build: Gulp (updated), not Vite

**Decision:** Gulp 5 + Dart Sass (gulp-sass) + esbuild for JS + PostCSS/autoprefixer with `browserslist` + browser-sync (proxy to the local WordPress) + separate `dev` / `build` / `zip` tasks.

**Why not Vite:** an Elementor project has little custom CSS/JS (the main styles are Elementor global styles), and HMR works poorly inside the Elementor editor's iframe. Gulp is familiar to the user and matches their other projects.

**Improvements over the previous classic-theme project:**
- gulpfile, package.json and node_modules live **outside the theme folder** (previously they were inside the theme — a risk of uploading them to the server).
- The default task builds everything on start (previously styles and images weren't built until the first change).
- `browserslist` in package.json instead of `last 15 versions`.
- Sourcemaps only in dev; production is minified without maps.
- Browser auto-reload via browser-sync.
- A `zip` task — a theme archive for handing over to the client.
- Asset versioning via `filemtime` (as in the previous project) — against browser/Cloudflare caching.

---

## D5. Local WordPress: wp-env → Docker Compose (since 2026-10-16)

**Decision:** `@wordpress/env` (the official WordPress tool, Docker), config `.wp-env.json` at the repository root.

**Why:** Docker is already installed; the whole site (WP version, PHP, theme, plugins, settings) is described by one file and reproduced with one command; WP-CLI runs inside a container (no local PHP/WP-CLI needed). Alternatives: LocalWP (GUI, not installed, less reproducible), our own docker-compose (more manual setup).

**Key details:**
- `"mappings": { "wp-content/themes/ai-elem-child": "./theme" }` — the `theme/` folder is mounted as the child theme.
- `"config": { "WP_ENVIRONMENT_TYPE": "local" }` — **required**: over http without SSL, WordPress allows application passwords only in a local environment, and without them Elementor MCP won't connect.
- Site: http://localhost:8888, WP-CLI: `npx wp-env run cli wp ...`.
- Docker Desktop must be running before start.
- **Where the data lives** (added 2026-10-05): wp-env files (WP core, plugins, uploads) — via `WP_ENV_HOME` in the project folder `.wp-env-home/` (not in git), so they don't take space on C:. Docker images and the wp-env database live in Docker's shared disk (`docker_data.vhdx`, on C: by default, ~39 GB as of 2026-10-05) — "just this project" can't be moved out of it; the whole Docker disk can be moved to D: in Docker Desktop settings (the user's decision, since it also affects other projects' containers).
- **The move was done manually on 2026-10-05.** The built-in move (Settings → Resources → Advanced → Disk image location) doesn't work in Docker Desktop 4.91: robocopy returns code 1 ("files copied"), Docker treats it as an error, doesn't apply the path and leaves an abandoned copy on the target disk (docker/desktop-feedback #548, #550). Workaround: `docker desktop stop` + `wsl --shutdown` → copy `%LOCALAPPDATA%\Docker\wsl\disk\docker_data.vhdx` to `D:\Docker\DockerDesktopWSL\disk\` → add the key `"CustomWslDistroDir": "D:\Docker\DockerDesktopWSL"` to `%APPDATA%\Docker\settings-store.json` (backslashes are doubled in JSON) → `docker desktop start`. After the move, containers, images and volumes matched the "before" snapshot.

### Update 2026-10-16: wp-env replaced with our own docker-compose

**Decision (chosen by the user):** instead of wp-env — `docker-compose.yml` at the project root (project `ai-wp-elem`): MariaDB, `wordpress:php8.3-apache`, `wordpress:cli-php8.3`. WordPress core, plugins and uploads live in a **Docker volume** (Docker's Linux disk on D:); only `theme/` is mounted from the project.

**Why:** wp-env puts WordPress on the Windows disk and mounts it into the container. On this machine, reading files across the Windows → Linux bridge turned out to be ~150 times slower than inside Docker's Linux disk (1000 Elementor files: 11.3 s vs 0.075 s). A page loads ~1450 PHP files → ~20 s for any page (7 s even with opcache revalidation turned off), a WP-CLI command ~20 s. Windows Defender is in passive mode — probably another security program scans the files; we didn't investigate. With a Docker volume: a page ~0.5 s, WP-CLI ~4 s.

**What else came up with wp-env on this machine** (for the future, if we go back to it):
- the network check via `dns.resolve` failed: Node's DNS client (c-ares) saw the server `127.0.0.1`, although the system resolver worked → wp-env decided it was offline and downloaded nothing;
- `EPERM` when renaming freshly unpacked plugin folders (the antivirus holds the files);
- plugin and theme folders are named after the zip: `elementor.latest-stable` instead of `elementor` → the child theme doesn't see its parent `hello-elementor`;
- the short links `downloads.wordpress.org/plugin/<slug>.zip` serve **trunk** (Polylang arrived as 3.9.0-rc1); the stable version is available only via `latest-stable` or a version number;
- the test environment (8889) is still enabled by default in wp-env 11.17.

**How it works:**
- `npm run wp:start` / `wp:stop` — `docker compose up -d --wait` / `stop`; the data stays in the volumes `ai-wp-elem_db` and `ai-wp-elem_wordpress`.
- `npm run wp:setup` — `docker/setup.sh` in the WP-CLI container: installs WordPress (admin / password), Hello Elementor, the plugins Elementor, SCF, Polylang (stable versions from WordPress.org, `wp plugin install`), activates `ai-elem-child`, removes Akismet and Hello Dolly, sets permalinks and the time zone. Safe to re-run.
- `npm run wp:cli -- <command>` — `docker compose exec cli wp …` (the WP-CLI container runs permanently: `exec` is ~2× faster than `run`).
- `WORDPRESS_CONFIG_EXTRA`: `WP_ENVIRONMENT_TYPE=local` (application passwords over http — needed for Elementor MCP), `WP_DEBUG_LOG` on, `WP_DEBUG_DISPLAY` off (notices don't break the JSON in REST/MCP responses). Log: `docker compose exec wordpress cat /var/www/html/wp-content/debug.log`.
- `docker/php.ini` — memory 512M, upload 64M; `docker/wp-cli.yml` — the site URL for CLI and `mod_rewrite`.
- The DB passwords in compose are local defaults, not secrets.
- To remove the whole site: `docker compose down -v` (deletes the volumes — only at the user's explicit request).
- The user's `npm` runs scripts through Git Bash (`script-shell` in `~/.npmrc`), so Git Bash turns arguments starting with `/` into Windows paths. The npm scripts have no such arguments; when calling manually from Git Bash — `MSYS_NO_PATHCONV=1`.

---

## D6. Repository structure

```
ai-wp-elem-practice/
├── CLAUDE.md, docs/        context, decisions, plan, log
├── .wp-env.json, .mcp.json, .gitignore, package.json, gulpfile.mjs
├── src/                    sources: scss/, js/, images/
├── theme/                  only what goes to the site (child theme)
│   ├── style.css (Template: hello-elementor), functions.php
│   ├── inc/                setup.php, enqueue.php, elementor.php
│   ├── widgets/            custom Elementor widgets
│   └── assets/             build output (not in git)
├── elementor/              export from the DB: kit/, design-system/, templates/, forms/ (D35, README)
├── design/                 Figma links, references (heavy files — not in git)
└── backups/                DB dumps (not in git)
```

**Why:** the tooling is separated from the theme — only `theme/` goes to the site / into the zip. The Elementor layout lives in the DB, so it gets its own export folder.

**Update 2026-10-16:** instead of `.wp-env.json` — `docker-compose.yml` and the `docker/` folder (`php.ini`, `setup.sh`, `wp-cli.yml`), see D5. `.gitattributes` keeps `*.sh` with LF — the script runs in a Linux container.

---

## D7. Database and deployment

**Fact:** the content of **any** WordPress site lives in the DB (pages, menus, SCF/ACF values, settings). Elementor adds the layout to it as well. A whole site = theme + plugins + uploads + DB.

**Scenarios:**
1. **A new site from scratch** — one full migration at launch (All-in-One WP Migration / Duplicator / WP-CLI: `wp db export` + uploads). After migrating Elementor: **Tools → Replace URL** (URLs in Elementor data are stored with escaped slashes, and a plain search-replace may miss them) and **Regenerate CSS & Data**.
2. **Working on the client's staging** (the most common case on Upwork) — we connect Elementor MCP directly to staging; the client's host pushes staging → live. We don't move the DB by hand.
3. **Edits on a live site** — the rule "**code goes up, content comes down**": theme files are deployed via git/SFTP; the production DB is never overwritten (form entries, orders, client edits); individual pages/sections are moved by exporting and importing an Elementor template (JSON).

---

## D8. Licenses and paid plugins

**Decision:** on client projects the **client buys the licenses, on their own account**. For practice — free versions only.

- This is standard: job posts say "All licenses will be added once completed", and clients ask about paid licenses themselves. In a proposal: "paid plugins are bought on your account; before we start I'll tell you which ones and what they cost".
- For practice: **Elementor Free** (MCP is free, basic features work), **SCF** (Secure Custom Fields — a free ACF fork on WordPress.org; according to WP Tavern and the changelog it includes Repeater, Flexible Content, Gallery, Clone, Options Pages, ACF Blocks — verify in practice, there are conflicting claims online), **Polylang Free**.
- Price guidelines (check on the official sites): Elementor Pro from ~$60/year for 1 site, Agency ~$400/year; ACF PRO ~$49/year; Polylang Pro €99/year, Polylang for WooCommerce €99/year.
- ❌ We don't use "nulled" plugins or resellers selling plugins for pennies ("95% off" sites) — no official updates, risk of malicious code, damage to reputation.
- Buying our own agency-tier licenses makes sense only with a steady flow of clients and when selling maintenance.

**Elementor Free limitations we account for:**
- Theme Builder (custom header/footer/post templates) — Pro. On Free: Hello's built-in header/footer (Site Settings), or in the child theme's code, or the free Header Footer Builder plugin. To be decided at stage 5.
- Dynamic Tags (outputting SCF/ACF fields in widgets) — Pro. On Free: we output fields through a custom widget (which also showcases PHP).

**Update 2026-10-17 (design assessment, Elementor 4.3.5):** what else is unavailable in Free and how we work around it:
- **Components** (`list-components`: `can_create: false`) — repeating sections are built on each page separately; global classes keep them consistent;
- **no working form**: the atomic `e-form` in Free is a Pro teaser (`is_pro_promotion`), although MCP lists it;
- **no atomic menus, carousel or map.**

What Free has: `e-accordion`, `e-tabs`, `e-grid`, `e-youtube`, `e-self-hosted-video`, `e-background-video`, `e-svg`, `e-divider`, V4 interactions, Default Styles per tag. Details — design/assessment.md, section 4.

---

## D9. Languages

- Communication — in Russian.
- Code comments — in English (clients may see the code).
- Documentation in `docs/` — in Russian in the working repository. This public repository is its English translation.

---

## D10. Secrets and MCP

- Figma MCP — in the project's `.mcp.json` (OAuth, no secrets in the file) — safe to commit.
- Elementor MCP — application password → only `claude mcp add --scope local` (stored in the user's Claude config, not in the repository).
- `.vscode/sftp.json`, `.env`, DB dumps, `*.wpress` — in `.gitignore`.

---

## D11. Design: General Website UI Kit; we design the mobile version ourselves (2026-10-05)

**Decision:** [General Website UI Kit](https://www.figma.com/community/file/1575073428722864118/general-website-ui-kit-fully-responsive-ready-to-use) from Figma Community, pages Home + Services + Contact. The kit has no separate mobile designs — we design the responsive behavior ourselves.

**Why:**
- A generic corporate site is the most common type of "business website" in job posts.
- Color variables and Auto Layout in the design → exact values via Figma MCP and a direct mapping to Elementor V4 global variables/classes (practicing the "global styles" requirement).
- The three pages pose different tasks: Home — many different sections and global styles; Services — repeating cards (reusable components, global classes); Contact — a form (on Elementor Free — through a free plugin, as in real projects).
- **The mobile version "the hard way"** — deliberately: Upwork clients often send only a desktop design and write "make it responsive". It's a real skill worth practicing.

**How we do the mobile version:** general rules (breakpoints, type and spacing scale, typical reflows, burger menu) go into `design/mobile-spec.md` during the initial assessment; the specific layout of each section goes into the proposal within the per-section cycle (D12) and is agreed before building. For the portfolio, the spec can be shown as part of the process.

**Downside and how we compensate:** the portfolio has no designer's mobile design to compare against — we show the spec and screenshots.

**Considered:** [Home Services – Website – UI Kit](https://www.figma.com/community/file/1257965372422620398/home-services-website-ui-kit) — has a 375×812 mobile version, local service business niche; kept as a fallback.

**Where the design lives:** a copy is in a sandbox in a paid Figma team (Dev/Full seat → ~200 MCP calls per day; on the free Starter plan — a handful per month). Data extracted from the design is saved in `design/` so we don't spend calls again. Before the portfolio — credit the design's author (the license is usually CC BY 4.0, check).

---

## D12. Build flow: initial assessment → foundation → per-section cycle (2026-10-05)

**Decision:** we build not "a whole page at once" but in three steps.

1. **Initial assessment of all designs** — nothing is built. Output: `design/assessment.md` (design tokens, section inventory, mapping to Elementor, Free limitations, assets, risks, order), `design/mobile-spec.md` (general responsive rules), `design/sections.md` (tracker). Signed off by the user.
2. **Foundation** — global styles in Elementor, header/footer and form decisions, page drafts. Signed off by the user.
3. **Per-section cycle:** link to the section → analysis → proposals (including the tablet and mobile layout) → work starts only after a "yes" → review against a checklist (the agent checks first). After sign-off — status in the tracker, an entry in `workflow-log.md`, a commit.

**Why:**
- The user wants the agent to analyze first rather than rush into execution (see CLAUDE.md, "How to work: analysis first, then execution").
- Assessing all pages upfront reveals repeating elements and tokens → global styles and classes are created once, and sections reuse them instead of multiplying one-off values.
- A small step (a section) is easy to check and roll back; a mistake doesn't spread across the whole page.
- Without a mobile design, responsive decisions are easier to make per section, looking at the specific layout.
- This is also how work with clients goes: assessment → agreement → staged delivery. The process and the tracker can be shown in proposals.

**Section review checklist:** desktop matches the design; tablet/mobile — as agreed; global styles without unnecessary one-off values; everything is editable in Elementor without HTML widgets; semantics and accessibility (headings, alt, buttons, contrast); optimized images.

**Self-check is mandatory:** via Playwright MCP — see D13.

---

## D13. Playwright MCP — the mandatory self-check tool (2026-10-05)

**Decision:** we connect Playwright MCP (`@playwright/mcp`, Microsoft) in the project's `.mcp.json`; a section isn't submitted for review without a self-check through it.

**Why:**
- The agent sees the result of its work through a browser's eyes, not just through Elementor data: it opens the page, takes screenshots at the design width, 768 and 375, compares them with the Figma frame and fixes discrepancies itself before the user spends time on review.
- Without a mobile design this is especially important: responsiveness is checked at real widths, not "by eye in the editor".
- Before/after screenshots are ready-made material for review, `workflow-log.md` and the portfolio.
- Why Playwright and not Chrome DevTools MCP: an official Microsoft server, window size control (`browser_resize`), full-page screenshots (`fullPage`), an accessibility tree snapshot (`browser_snapshot`) — useful for checking semantics.

**Details:** on native Windows, npx servers are launched via `cmd /c`; Elementor drafts are visible only after logging in to WordPress — we log in inside the Playwright browser; screenshots go to `design/screens/` (not in git).

---

## D14. Asset build: images → WebP, SVG stays vector; JS — esbuild directly (2026-10-16)

**Decision:**
- The `images` task: raster images (jpg, jpeg, png) are converted to WebP. SVG isn't rasterized and stays vector (logo, decorative elements). Other files are copied as is.
- JS is built by calling the `esbuild` API directly from the gulpfile, without `gulp-esbuild`.

**Why:**
- WebP is lighter than JPEG/PNG at the same quality and is supported by all current browsers. This is an item on the review checklist (D12, "optimized images").
- SVG is vector: crisp at any pixel density, and its color can be changed via CSS. Rasterizing degrades quality and increases weight.
- `gulp-esbuild` is a thin wrapper around the same API: without it there's one dependency less and no tie to its update pace.

**Scope:** theme images only (`src/images/` → `theme/assets/images/`). Content images are uploaded to the WordPress media library (stage 5.2) and don't go through Gulp.

**Tools** (agreed 2026-10-16, stage 2):
- **WebP — `sharp`** (quality 80; only WebP goes into the theme, no originals). Not `gulp-webp`: it works through `imagemin-webp` / `cwebp-bin`, the binary is downloaded at install time, and on Windows that's a frequent source of failures; the imagemin ecosystem is barely updated. `sharp` has prebuilt binaries for Windows.
- **SVG — `svgo` 4**, `preset-default` with `cleanupIds` disabled (ids may be used in CSS/JS). `viewBox` and `<title>` are kept by default in SVGO 4.
- In Gulp 5, `src()` reads files as UTF-8 text by default — for images and zip, `encoding: false` is required, otherwise binaries get corrupted.

---

## D15. npm audit warnings in the build tools (2026-10-16)

**Decision:** we don't run `npm audit fix --force`; we accept the warnings and re-check them when updating packages.

**Why:**
- As of 2026-10-16, `npm audit` shows 22 vulnerabilities — all in nested dependencies of the **latest** versions of gulp, browser-sync, del and `@wordpress/env` (braces/micromatch, simple-git, qs/express in wp-env's Playground mode). npm's "fix" is a rollback to versions that are many years old (gulp 3, wp-env 3, browser-sync 2.25), i.e. worse.
- These are dev tools that run only locally; they don't end up in the theme or on the client's site.
- The `EBADENGINE` warning (`@php-wasm/scopes` requires Node 24) relates to wp-env's experimental Playground mode; we use Docker, and Node 22 is enough.

**Update 2026-10-16:** `@wordpress/env` was removed (D5) — taking with it the critical (simple-git) and moderate (qs/express) vulnerabilities and `EBADENGINE`. 13 "high" ones remain — the braces/micromatch chain in gulp, browser-sync and del; same decision.

---

## D16. Connecting MCP: Figma, Elementor, Playwright (2026-10-17)

**Decision:** three servers for the project. Figma and Playwright — in `.mcp.json` (in git, no secrets), Elementor — `--scope local` (the application password is in `~/.claude.json`, outside the repository).

**Figma** — `{"type": "http", "url": "https://mcp.figma.com/mcp"}`, OAuth login via `/mcp` → figma → Authenticate. The sandbox with the design is in a paid Figma team (Pro plan, Full seat) → 200 calls per day, 10–15 per minute. Other teams on the account are on the Starter plan (6 calls per month) — keep designs only in the paid team. `whoami` shows plans and seats if we hit the limit.

**Elementor** — the format that Elementor → MCP (4.3.5) gives for Claude Code:
- HTTP server `http://<site>/wp-json/elementor/mcp/`, header `Authorization: Basic base64(<login>:<application password>)`. Elementor creates the application password itself ("Elementor MCP - Claude Code (date)"); revoke it under Users → Profile → Application Passwords.
- Elementor's prompt asks to add the server to `mcpServers` in `~/.claude.json` — that's the **global** scope (all projects). Instead: `claude mcp add --transport http --scope local elementor <url> --header "Authorization: Basic …"`. The name `elementor` instead of the suggested `<site>-elementor` — shorter tool names.
- **Windows + VS Code gotcha:** the extension runs the session in `d:\front-end\…` (lowercase drive letter), while `claude mcp add` from the terminal wrote the project key `D:/front-end/…`. Key comparison is case-sensitive, so the server didn't make it into the VS Code session. By the user's decision the entry is duplicated under `d:/front-end/projects/ai-wp-elem-practice` (with a copy of `~/.claude.json` made before the edit). Add new local servers the same way under both keys, or via `/mcp` in the VS Code chat.
- 20 tools: page creation, `build-composition` (an XML tree of atomic elements + CSS strings; `@media(--mobile)` becomes native breakpoint styles), `manage-elements`, V4 global variables and classes, default styles per tag, components, `create-preview-link` (a one-time link for the agent's self-check — give the user the `edit_url`). **No media upload** — images go via WP-CLI `wp media import`, then `list-assets` and insertion by ID.
- For client sites: the user (or the agent) runs the command with the password in a terminal, without pasting the password into the chat; a live site needs HTTPS (application passwords over http work only with `WP_ENVIRONMENT_TYPE=local`); revoke the password after the project.

**Playwright** — `cmd /c npx -y @playwright/mcp@0.0.83 --browser chrome --output-dir design/screens`:
- the version is pinned (the 0.0.x package changes almost weekly); update deliberately;
- `cmd /c` was kept: the current Claude Code docs say nothing about it, and with it the server reliably starts on native Windows;
- the installed Chrome was picked up; no browser download was needed;
- persistent profile `%LOCALAPPDATA%\ms-playwright\mcp-chrome-<hash>`: the WordPress login (Remember Me) persists between sessions; Elementor drafts open via the preview link;
- besides screenshots, `design/screens/` also receives page snapshots (`.yml`) and console logs — all outside git.

**Connecting in VS Code:** new servers are picked up only in a new conversation — **Developer: Reload Window** (the conversation is restored). VS Code didn't ask for permission for the `.mcp.json` servers — they connected right away.

---

## D17. Design assessment outcome: decisions made (2026-10-17)

The assessment (design/assessment.md) was accepted by the user with all recommendations.

**Design and content:**
- **Tokens** — a cleaned-up set with our own names (design/tokens.md); we don't carry over the red scale and the typos from Figma.
- **Font** — Quicksand only; places with Roboto and Rubik and the off-palette dark blue (footer, Contact) are brought into the palette.
- **Orange words in headings** — `#cc7f0c` (contrast 3.18:1 — the threshold for large text); backgrounds and backings stay `#fdb048`.
- **Lead text** — `#6d6d6d` instead of `#888` (5.17:1 instead of 3.54:1).
- **Design typos** (Proplem, FQA, Servecies) are fixed.

**Functionality:**
- **Testimonials** — a static layout on desktop and a swipeable strip (CSS scroll-snap) on tablet and mobile, no JS. *Revised during the G4 build: a "coverflow" carousel with JS — D28.*
- **Video and timeline animation** — static in the first iteration (as in design/README). *The timeline was revised during the H8 build: the dot follows the scroll — D29.*
- **Map** — an image linking to Google Maps (atomic, editable in Elementor).
- **Menu** — 5 items as in the design; About and Blogs are placeholder links.
- **Form** — **Contact Form 7** (free and the most widespread — clients know it). Styles — child-theme SCSS based on the tokens.

**Header and footer — our own mini Theme Builder in the child theme.**
- **How:** the header and footer are built in Elementor as templates (atomic, via MCP); the child theme outputs them on all pages through the Elementor API. This is how HFE and Theme Builder Pro work internally.
- **Why:**
  - the client edits the header and footer in Elementor, like the other sections;
  - the same global classes work;
  - no dependency on a third-party plugin;
  - the same technique will help with repeating sections (Free has no Components);
  - for the portfolio it's an "Elementor + custom code" hybrid.
- **Check first:** MCP creates and edits such a template; the theme outputs it together with V4 styles; the burger on our JS is keyboard-accessible.
- **If the check fails — the Header Footer Builder (HFE) plugin**, not pure PHP (the user's decision).

---

## D18. Foundation on Elementor V4: how it works and what we found (2026-10-17)

**Design system in Elementor** (all via MCP; details and the full list — design/tokens.md):
- **20 color variables + `font-primary` (Quicksand).** Size variables are Pro-only, so the size scale lives as values in Default Styles and classes.
- **V4 variables end up in CSS under their own names** (`var(--color-primary)`), so the theme SCSS uses the same tokens.
- **Default Styles** `h1`–`h4`, `p` — font, color, sizes at 3 widths (verified via computed styles at 1440, 768, 375).
- **20 global classes.** Order = priority (the first one is stronger): modifiers (`card--dark`, `btn-small`, `section-header--center`) sit above the base classes. In HTML, classes are output **under their own names** (`class="btn-primary btn-small …"`), so SCSS can hook into them.
- **The kit's V3 global fonts and colors** (for classic widgets: Shortcode, CF7) — Quicksand and the palette. "Disable Default Colors/Fonts" is on, so Roboto and Roboto Slab aren't loaded.

**MCP / V4 pitfalls in Free:**
- **Non-native properties silently go into `custom_css`, and Free strips it.** This happened with `width: fit-content` and `outline`. MCP rejects per-side border properties with a warning. Check after creating classes: decode `custom_css` in `_elementor_global_class_data` (the command is in the log). Whatever can't be expressed natively we do in the theme SCSS (the focus ring — `:focus-visible`).
- **`e-div-block` has `padding: 10px` by default.** Decorative blocks (a divider) need `padding: 0`.
- **Attributes are stripped from heading text** (`class`, `style` on `span`), tags remain. Words in headings are highlighted with tags (SCSS `base/_highlights`): `<strong>` (Bold in the panel) — purple, `<em>` (Italic) — orange without italics, `<b>` — just bold.

**Site Parts — our own mini Theme Builder (option B from D17 — the check passed):**
- **Storage.** Post type `aiec_part` ("Site Parts" in the admin), slugs `header` and `footer` — a contract, don't change them. A part's draft is visible only to those who can edit it (handy for checking before publishing).
- **Output.** The child theme overrides Hello's `template-parts/header.php`, `footer.php` and `dynamic-*.php`. If there's no part, Hello's header or footer is shown. On the part's own page (the editor preview) there's no header or footer.
- **Styles.** Elementor enqueues atomic and class styles only for documents declared via `elementor/post/render` before `after_enqueue_post_styles`. Parts render later, in `<body>`, so the theme declares them on `elementor/frontend/after_enqueue_styles`. Without this, the global class CSS isn't loaded on the page.
- **Verified:** MCP creates and edits parts; the Elementor editor opens them; class styles and local styles apply; Hello's header CSS is removed.

**Form (CF7, D17):**
- the form "Contact" (`[contact-form-7 id="d55494c" title="Contact"]`);
- the shortcode can be inserted into an atomic paragraph, but that yields a `<form>` inside a `<p>` — invalid markup;
- the right option is the classic **Shortcode** widget inside an atomic section. MCP doesn't place it, so we insert it through the Elementor document API from WP-CLI (`--user=admin`, otherwise `save()` silently doesn't save);
- submission verified: the email arrives in Mailpit.

**Local environment (addition to D5):**
- **Mailpit** (`axllent/mailpit:v1.31.4`) catches all mail, UI — http://localhost:8025. The dev plugin `docker/mu-plugins/local-mail.php` (`local` only) sends mail there and replaces the sender `wordpress@localhost`, which PHPMailer rejects.
- **Loopback requests.** Apache listens on 80 and 8888, the port is forwarded `8888 → 8888`, and the WP-CLI container lives in the `wordpress` container's network (`network_mode: service:wordpress`). So `http://localhost:8888` works from inside too. Without this, Elementor couldn't read SVG dimensions; Site Health and WP-Cron need it as well.
- **SVG to the media library** — `npm run wp:import -- <file in design/assets> --title=… --alt=…` (the `wp aiec import` command in `docker/wp-cli-commands.php`). The SVG is cleaned by Elementor's sanitizer and accepted as an Elementor upload. Requires the "Unfiltered File Uploads" setting — enabled in `setup.sh`. We don't allow SVG globally in WordPress.
- **Incident:** the WSL relay (`wslrelay`) stopped passing IPv4 on `127.0.0.1:8888`, while IPv6 worked. Rebinding the port by recreating the container fixed it. If the site "hangs" from the host on `127.0.0.1` but responds on `[::1]`, the problem is the relay, not the site.

**Addition (2026-10-17):** backups — `npm run wp:backup` (the `wp aiec backup` command: a `.sql.gz` database dump + an `uploads` archive in `backups/`; the folder is mounted into the WP-CLI container) and `npm run wp:restore -- <time>`. The first backup — `20261017-211430`, right after the foundation.

## D19. Header and footer: conventions that emerged in G1–G2 (2026-10-18)

**Menus.** Two custom widgets for WordPress menus: **Nav Menu** (header: burger, full-screen menu on phones) and **Menu List** (a simple column of links for the footer). The link style with a growing line is a shared `menu-link` mixin (`src/scss/tools/_mixins.scss`). One menu can sit in both the header and the footer (Primary): Menu List gives the list a unique `id` and removes `id` from the items so there are no duplicates.

**Shortcodes.** On pages they're executed by the `the_content` filter (that's why CF7 in a paragraph worked in D18). The theme outputs Site Parts bypassing it, so `aiec_render_site_part()` runs the part's output through `do_shortcode`. Custom shortcodes — in `theme/inc/shortcodes.php` (`[aiec_year]` — the current year). In the Elementor editor the shortcode is shown as text.

**What V4 can't express, we finish in the theme SCSS** (addition to D18):
- link underline color and offset, the tap area of an inline link — `base/_links` (in Elementor the `link-underline` class sets only the font and colors);
- a background image can't be removed on a single breakpoint (`background-image: none` is silently dropped) — we remove it in SCSS (`base/_site-footer`). Its size can be changed on a breakpoint only by setting the background again on that breakpoint with all properties; otherwise the size is rejected.

**Anchors.** `html { scroll-padding-top }` for the sticky header and smooth scrolling (except with `prefers-reduced-motion`) — `base/_scroll`. The "back to top" button is a `#top` link: the browser scrolls to the top of the page when there's no element with that id.

**SVG in `e-svg`.** Elementor inlines the SVG into the markup and sets `fill="currentColor"` on the root, so for outline icons we set `fill="none"` on a group inside. If one file appears twice on a page (the logo in the header and footer), its internal `id`s are duplicated and `url(#…)` references point to the first instance — such SVGs are cleaned of `id`s and masks (the logo was cleaned, the file of attachment 46 replaced in place, the rendering compared pixel by pixel).

**Widths 1025–1279.** There's no breakpoint between tablet (1024) and the design (1440). A row of several blocks on desktop is built without wrapping, letting the text blocks shrink (fixed ones — logo, icons — get `flex-shrink: 0`); otherwise the last block jumps to a new row. We add widths 1025 and 1180 (iPad Pro in landscape) to section self-checks. We didn't enable an additional Elementor breakpoint (Tablet Extra / Laptop): it's a global change — to be decided if this recurs in several sections. *It recurred in H1 — Tablet Extra enabled (D21); the footer was left on shrinking.*

## D20. Illustrations and animation in SVG; what we found in H1 (2026-10-18)

**Illustrations are vector SVGs built from the Figma sources.** Raster pieces of the design (the dot map — a 4096 × 2048 JPEG, 2.2 MB) are converted to vector if they're geometrically simple: 4151 dots → one `path` (24 KB gzipped). The generator lives in `tools/` (`tools/build-hero-map.mjs`), the Figma sources — in `design/figma/<section>/` (not in git), so it can be rebuilt without new Figma calls. The result is compared with the reference pixel by pixel.

**Animated SVG — via `e-svg` (inline), not `e-image`.**
- An SVG in `<img>` doesn't see the page's `prefers-reduced-motion` (verified: the animation didn't stop). An inline SVG obeys the page's media queries.
- Inline, the SVG shares the document with the page: ids and classes inside get a prefix (`aiec-hm-…`), otherwise conflicts are possible.
- A decorative SVG gets `aria-hidden="true"` on the root.

**`e-svg` and editor pitfalls:**
- `fill="currentColor"` on the root (D19) also fills open curves — everything drawn with strokes is wrapped in `<g fill="none">`.
- The editor's client-side sanitizer strips `<use>` (on the site it works) — repeated shapes are inserted as copies.
- `<style>`, classes, `style` attributes and gradients are preserved by Elementor's sanitizers (both server and editor).

**Elementor and MCP:**
- MCP doesn't accept `max-width: none` — set an explicit value (`1422px`, `132.84%`).
- First fill of an empty published page: after `publish-document`, the page's local CSS didn't appear until we ran `wp elementor flush-css`. Subsequent publishes rebuilt the CSS on their own. If a page's styles have "disappeared", flush the CSS cache first.
- In the editor canvas, Elementor removes the pre-built CSS files of atomic styles and injects styles only for the document being edited, so the header and footer (Site Parts) appear without their styles in another page's canvas. On the site everything is fine. *Fixed (D21).*

**Environment:** the WSL relay's IPv4 hang recurred (after a Docker restart). Fix — `docker compose up -d --force-recreate wordpress cli` (`cli` lives in the `wordpress` container's network, so it's recreated together with it).

## D21. Tablet Extra breakpoint, part styles in the editor, the Hello kit trap (2026-10-18)

**Tablet Extra = 1200 (the user's decision).** Between tablet (1024) and the design (1440), two-column sections are cramped: in H1 at 1025 only a strip of the map was left. The `tablet_extra` breakpoint (≤1200) is enabled: MCP understands `@media(--tablet_extra)`, and Elementor loads the files in the order ≤1200 → ≤1024 → ≤767, so tablet and mobile refine its styles. Elementor started loading `custom-frontend.min.css` instead of the standard file (that's how it works with additional breakpoints). The footer is left on row shrinking (D19) — it works at these widths too.

**Trap: saving the kit resets the header menu.** When the kit is saved, the Hello theme's "Header" tab in Site Settings writes its "Menu" field (`hello_header_menu`) to the `menu-1` menu location. It was 0, so saving the kit from code (`$kit->save()`) unassigned the Primary menu from the header — the menu items disappeared from the site (found by a self-check in the editor, fixed). The same would happen if the client clicked "Save" in Site Settings. Now `hello_header_menu = 2` (Primary). Rule: change kit settings from code via `update_settings()` (without the save handlers), and after changing the menu in "Appearance → Menus", remember that the kit keeps its own copy.

**Header and footer styles in the editor canvas.** In the canvas, Elementor removes all `<link>`s of the form `local-<id>-…-css` / `global-<id>-…-css` (of any document) and renders styles only for the one being edited. The theme (`aiec_keep_site_part_styles_in_editor()` in `theme/inc/site-parts.php`) prints the parts' CSS as an inline block in preview mode, with every selector prefixed by the part's wrapper (`.aiec-site-header …`). The prefix is needed for two reasons: without it, the footer's global classes (`.container`) overrode the containers of the edited page, and the editor's base styles, injected later, overrode the parts' styles. In the part's own canvas the block isn't output, so live edits aren't overridden by anything. The first attempt (copies of the files under our own handles) broke the hero layout in the canvas — found by a self-check.

**Check animations by computed values over time.** An element having an `animation-name` doesn't mean it's moving: Chrome didn't interpolate the keyframe `stroke-dashoffset: calc(var(--period) * -1)` but jumped by exactly one period — visually nothing happened (noticed by the user). Check: several `getComputedStyle()` measurements at intervals — the values should keep increasing. In keyframes — fixed values, no `var()`.

## D22. Global classes in Site Parts: one class + local styles (2026-10-18)

**What happened.** The header button (`btn-primary` + `btn-small`) on Home became 139 × 48 instead of 100 × 34, and the header 80 px instead of 67; on Services everything was correct. Elementor writes global class CSS into a separate file per document (`global-<id>-…css`) and loads them in turn: header, footer, page. On Home, `btn-primary` is also used in the page itself — its rule from the page file comes after `btn-small` from the header file and overrides it, despite class priority (priority works only within a single file).

**Rule.** In Site Parts, no more than one global class per element; modifiers go into local styles (local files load after all the global ones, and document order doesn't affect them). On pages, combining classes is fine: the page file is last and the order within it is correct. Header: `btn-primary` + local 8/16, 12/18, radius 8.

**Along the way (user feedback):** burger 34 × 34 (a square as tall as the button), logo at ≤576 — 96 × 29 (SCSS: Elementor has no 576 breakpoint). Header height: 67 / 59 / 54 (desktop / tablet / mobile).

## D23. Placeholder logos and a marquee (2026-10-18)

**Placeholders instead of other companies' brands (the user's decision).** The kit's "Trusted by…" block has real logos (Webflow, Relume) — on a published site this reads as a claim of partnership. We use made-up logos: mark + word (Company, Studio, BRAND, Agency, Partner), Google Fonts under the OFL license, letters converted to outlines (an SVG in `<img>` doesn't load web fonts). The generator — `tools/build-logo-placeholders.mjs` (dev dependency `opentype.js` 1.3.4; it added no new `npm audit` warnings), the fonts — `design/assets/fonts-src` (not in git). Rule for the future: we don't carry third-party trademarks from kits onto the site.

**Marquee on phones (the user's decision).** The client edits the markup — Elementor holds only one set of logos; the copy for a seamless loop is added by JS (`src/js/modules/logo-marquee.js`), the styles — `src/scss/base/_logo-marquee.scss`, the hook — the `logo-marquee` global class on the wrapper. Rules:
- the copy is hidden from screen readers (`aria-hidden`, empty `alt`) and has no Elementor `data-id`;
- in the Elementor editor the JS does nothing (`body.elementor-editor-active`) — the client sees and edits an ordinary row;
- `prefers-reduced-motion` — no marquee; touch — pause; mouse hover — pause only on devices with `hover: hover` (on touch screens hover "sticks");
- the gaps are `margin` on each logo, not `gap`: the −50 % shift must be exactly one set;
- the row inside the wrapper is `flex: 0 0 auto`, otherwise as a flex item it shrinks to the screen width (found by a self-check: the marquee ran 5 times slower and jerked).

**Testing Web Animations API animations:** after `animation.pause()`/`play()` from a script, the browser stops honoring CSS `animation-play-state` — test pausing via a CSS class on a fresh page.

## D24. What we found in H3 (2026-10-18)

- **The dark card pattern lives in the `card--dark` class** (background image `card-mesh.svg`, `100% auto`, centered): dark cards on Services and in pricing will get it automatically. MCP stores a background in a global class natively.
- **A shared dot-map module** — `tools/lib/world-dots.mjs` (hero and H3); after extracting it, the hero map rebuilds byte for byte.
- **V4 doesn't support `white-space`** (nor `max-width: none`, D20) — text wrapping is controlled by block widths.
- **An inline `e-svg` doesn't get the `elementor-element-<id>` class** — in checks, find atomic elements by `data-interaction-id`.
- **Section screenshots:** when shooting an element, the sticky header covers the top of the section — for delivery we hide the header during the shot (`display: none`, not `visibility`).
- **The WSL relay** hung on IPv4 for the third time in a day (D18, D20). For now we fix it by recreating `wordpress` and `cli`; it's worth finding a permanent fix (e.g. explicitly binding the port to `127.0.0.1` or updating Docker Desktop) — as a separate task.

## D25. What we found in H4 (2026-10-18)

- **Anchors on atomic elements:** the `e-flexbox` schema has no id field, but MCP accepts the `_cssid` setting — Elementor outputs `id="…"` on the element (that's how `#innovation` is done). The offset for the sticky header comes from `scroll-padding-top` (D19).
- **Decoration that has to be hidden on a breakpoint** is a separate element (`e-image`, absolute positioning, `display: none` on the relevant breakpoint), not a background: V4 can't remove a background image on a single breakpoint (D19).
- **Raster decoration from Figma:** `get_screenshot` on a node returns a PNG with transparency, with the node's opacity and blur already applied — we convert it to WebP (D14). The size is 1× (the tool won't return more than the node size); for a pale, blurred decoration that's enough.
- **A white panel with an orange offset backing** — the `panel-accent` global class (a counterpart to `card--dark`).

## D26. What we found in H5 (2026-10-18)

- **Gradients in V4 backgrounds work natively** (`background-image: radial-gradient(...)` as a layer over the color), but only with percentage stops; MCP rejects a form with a pixel size (`circle 420px at …`).
- **Careful with rejected background values:** on an `update` with an unsupported `background-image`, MCP issues a warning and **removes the entire background layer** (the old gradient disappeared). After background warnings, check right away what's left.
- **`e-flexbox` defaults to `width: 100%`** — for circle "buttons" and other content-sized elements, set `width: auto` (the white play circle stretched to full width; found by measurement).
- **Class modifiers** (`badge--on-dark`) are created and immediately moved above the base class (`reorder-classes`): new classes go to the end — with the lowest priority.

**Addition to D26 (2026-10-18, user feedback on H3):**
- **Dividers — the atomic `e-divider` widget, not an empty `e-div-block`.** In the Elementor editor an empty container is shown as a 120 px placeholder with a "+" (a drop zone for widgets) — confusing for the client, and an element can be dropped into it by accident. `e-divider` is a leaf, outputs `<hr>`, and defaults to a 1 px line with a black background; the `divider-gradient` class now sets a transparent color and a gradient. The dividers in H3 and in the style guide were replaced.
- **Once more about backgrounds (D26):** `background-color` and `background-image` in V4 are one composite background. Editing only the color in a class removed the gradient — always change a background in a class or element as a whole (color + image/gradient in one edit).

## D27. Overlapping cards, phone slider (G6, 2026-10-18)

- **Absolute positioning in V4:** `e-flexbox` defaults to `width: 100%` — with `left` + `right`, the width wins and the element stretches (found by measurement: cards 1297 px wide each). To stretch by insets — `width: auto`.
- **Interactive "stacks" and sliders** use the same technique as the logo marquee (D23): markup and per-breakpoint layout in Elementor, behavior — a JS module keyed on a hook class (`card-stack`), mode styles — SCSS with `.elementor` in the selector and under `.is-ready`; the module doesn't run in the editor.
- **Phone slider** — CSS scroll-snap (as decided for testimonials in D17); JS creates the dot buttons. Slide order = visual order (taking `order` into account), not markup order — compute the scroll offset from the first visible card (bug found by a test: dot 2 led to the wrong place).
- **Testing clicks on overlapped elements:** Playwright clicks the element's center — a neighbor may lie there. Click on the visible part (`position`).

## D28. Testimonials: a "coverflow" carousel, shared slider dots, output details (G4, 2026-10-18)

- **Carousel (the user's decision — the "coverflow" option):** the "default" layout in Elementor is the testimonials in a regular wrapping grid (that's how the client sees them in the editor and how the page looks without JS). The modes are enabled by a JS module keyed on the hook class `testimonial-carousel` (as in D23 and D27): > 1024 — the active one in the center, the rest around it via CSS `order`, scaling down and dimming via `data-distance` in SCSS; ≤ 1024 — a scroll-snap strip.
- **Scaling without "holes":** the `scale` property (the standalone one, not `transform`) from the bottom center + negative margins `−(1 − s) × 397 / 2` — the visible gaps stay at 64, as in Figma (there the scaled-down cards take up less room in the row).
- **Smooth movement — FLIP:** record the centers, change `order`, measure again and animate the `translate` property (Web Animations API) from the difference to zero. Meanwhile `scale` runs as a CSS transition and doesn't interfere: they're different properties. A testimonial that wraps around doesn't fly across the whole row but slides in from the edge. On fast clicks, a new animation starts from the current position (`getBoundingClientRect` is measured before cancelling the old one).
- **The row is `overflow: clip`, not `hidden`:** `hidden` remains programmatically scrollable, and keyboard focus would shift the row.
- **Slider dots — a shared module** `slider-dots.js` (G6 and G4): a dot for every position where the strip can stop, not for every slide. When two slides are visible, the last one never becomes first — at 768 there are 4 dots, not 5. Recalculated on width change (`ResizeObserver`).
- **`id` on images:** Elementor's atomic Image outputs the attachment ID as an attribute (`<img id="134">`) — the same image twice on a page produces duplicate `id`s. The theme removes numeric `id`s from `e-image` with the `elementor/frontend/the_content` filter (`theme/inc/elementor.php`); a CSS ID set in the editor isn't touched.
- **SVG through Elementor's sanitizer:** the contents of `<filter>` (shadows, blur) are stripped entirely, and an element with an empty filter isn't drawn. A soft shadow is done with a radial gradient.
- **Focus:** Hello's reset `[tabindex]:not([tabindex="-1"]):focus-visible` is more specific than our rule, so elements with `tabindex` (G6 cards, testimonials) had a black outline. `base/_focus` uses the same `:not()`; the outline is now on-brand everywhere.

## D29. Timeline with a scroll-following dot (H8, 2026-10-18)

- **The dot animation** (in D17 / the assessment — "static in the first iteration") was built at the user's decision: the dot travels along the line as you scroll. It's `position: sticky` (the Figma prototype works the same way — the "boat" layer), no JS: it stays at the middle of the viewport, bounded by the track. With `prefers-reduced-motion` the rule isn't applied — the dot stays at the first item.
- **The dot's initial position** is set by the track's offset, so the first heading must sit predictably: at ≤ 1200 the items are aligned to the top (on desktop — to the center of the image, as in the design). Check — the difference "dot center ↔ midpoint between the heading and the dashed line" at all widths.
- **A fading dashed line** of variable length — `::before` with a `linear-gradient` and a `repeating-linear-gradient` mask in SCSS (V4 can't do this); a short fixed-length dashed line — an SVG in `e-image`.
- **A `tablet-extra` (1200) breakpoint added to SCSS** — matching Tablet Extra in the kit (D21).
- **Raster illustrations from Figma at 2×:** `get_screenshot` doesn't upscale (`maxDimension` only caps the size) — for 2×, use `download_assets` with `defaultFormat: png`, `defaultScale: 2`. A node's SVG export may grab the canvas around it (gray background, UI frames, `foreignObject`) — check before use.

## D30. Gradient card border, element cache, background grid (H9, 2026-10-18)

- **Gradient border** (the user's decision — as in the H4 and H9 designs): `border-color: transparent` + two background layers — white on `padding-box` and the gradient on `border-box`. V4 can't do this — SCSS on the `card--outline` class; in Elementor the class keeps a plain 1 px border as a fallback. The gradient was matched to the reference by measuring the "paint" across the border.
- **Specificity vs global classes:** Elementor outputs a class as `.elementor .card--outline` in a file that loads after `main.css` — at equal specificity it wins. If SCSS changes a property that's set in the class itself, double the class (`.elementor .card--outline.card--outline`). Our other rules worked because they changed properties not present in the class, or had an extra state class (`.is-ready`).
- **Elementor element cache** (`_elementor_element_cache`, one day): publishing clears it, but if the edits are already saved and `publish-document` has nothing to publish, the cache stays — the new section didn't appear on the site. Edits to global classes also clear the cache, which is why this hadn't come up before. After a build, check that the section is in the HTML; if not — `npm run wp:cli -- elementor flush-css` (clears both the CSS and the element cache).
- **A dashed background grid** — an SVG as the section background with `background-size: 100% 100%` and `preserveAspectRatio="none"`; `vector-effect="non-scaling-stroke"` (the sanitizer lets it through) keeps the stroke width and dash spacing when stretched. The section stays free of extra elements, and the background is changed in Elementor.
- **Intermediate widths for card rows:** the design's `min-width` (300) with a 64 gap breaks a row of three already at ~1200 (and with the window scrollbar — at 1201). Choose the minimum so that three in a row hold up to tablet — check at 1201 and 1025.

## D31. CTA background: CSS gradient + grid as a separate layer; large WordPress images (G3, 2026-10-19)

- **Background — CSS, pattern — a layer** (the user's decision): the gradient that makes up almost the entire background is set in Elementor (the colors are edited there, and it scales without cropping); the pattern (grid) is a separate transparent image on top. The first option was "the whole background is one image from a Figma render"; it was replaced.
- **Two background layers can't be set via MCP:** the converter rejects `background-image: url(…), linear-gradient(…)` and wipes the background (as in D26). The second layer is an `e-image` element over the whole section: `position: absolute`, insets 0, `object-fit: cover`, `z-index: −1`, plus `z-index: 0` on the section (otherwise the layer goes under the section's background). MCP doesn't accept gradient direction keywords (`to bottom right`) either — an angle is matched to the section's proportions on each breakpoint.
- **Cutting the pattern out of a Figma render:** wipe the content with a mask, subtract the local background (a wide blur), and turn everything lighter into white with transparency. sharp traps: a single-channel raw input yields three channels on output (the buffer is read with an offset — stripes) unless the chain ends with `greyscale()`; a large-sigma blur at integer precision shifts brightness by ~2 levels — `precision: 'float'`; `extract` and `extend` in one chain run in a different order. A transparency threshold (the haze between lines) halves the file size.
- **Figma renders of the same frame can differ** if the fill is animated (video/GIF): compare the cut-out layer with the frame it was cut from, not with the reference.
- **WordPress downsizes images wider than 2560 px** (`-scaled`) and recompresses them at low quality, and the attachment's `full` size is exactly that downsized copy. Prepare images for backgrounds and layers at up to 2560 px wide.
- **A background on a breakpoint** can be set only as a whole (color + image/gradient + size + position) — MCP rejects a standalone `background-position` (addition to D26). Positions go in "vertical horizontal" order: `center left`.

## D32. Services page — built autonomously, questions in a batch at the end (2026-10-19)

- **The user's decision:** the agent builds the Services page on its own from start to finish, without approving each section; at the end — a report with screenshots and a short batch of questions (only what genuinely requires the user's decision).
- **The rules are the same as those established on the home page:** the palette (D17) and Quicksand only; design typos are fixed, "RedGraphs" etc. → "Legite", a single badge; publish immediately; interactivity and animations — moderate, in the spirit of the home page, respecting `prefers-reduced-motion`; heavy decoration is removed on phones; no empty placeholders in the editor; self-check at 1440 / 1201 / 1180 / 1025 / 1024 / 768 / 375 and in the editor; the Elementor element cache — check after the build (D30).
- **Order for each section:** analysis → build → self-check → records (`sections.md`, `decisions.md`, log) → commit. Status — 👀 until the user signs off.
- **Stop and ask immediately:** a change to a shared class that alters the accepted home page; going beyond `decisions.md` (plugins, Pro, paid assets); risky actions with the database or Docker.

## D33. What we found on the Services page (2026-10-19)

- **Element cache after every build:** on a new page, publishing after `build-composition` was almost always a no-op, and the site served the old HTML. Now `wp elementor flush-css` (D30) runs after every build, not just "if the section is missing".
- **Lists in V4:** MCP has no atomic list, and the browser splits a `<ul>` inside an `e-paragraph` with the `p` tag (the list falls out of the paragraph along with the class). An item = a paragraph with a global class; the marker — SCSS `::before`.
- **A class's image can't be removed locally** (`background-image: none` isn't accepted, and a local background color doesn't cover the class's image): for a dark card without the pattern, the `card--dark` class is removed and its properties are set locally.
- **MCP doesn't accept `align-items: baseline`** — bottom alignment with a correction instead.
- **Purple sections — the `bg-primary` class:** SCSS hooks into it for light slider dots and a white focus outline (a purple outline isn't visible on purple).
- **FAQ — the atomic `e-accordion`:** native `<details name>` (only one open, without JS), the icon rotates on its own, FAQPage markup is included. Inside `<summary>` the question is an h3 heading (a `<p>` paragraph isn't allowed there). The icon slot defaults to 200 px wide — set 24. Smooth expansion — `interpolate-size` and `::details-content` (progressive enhancement).
- **The H9 background grid in sections of other heights:** `background-size: 100% 626px`, centered, puts the lines where they are in the design (there the grid is always 658 px, centered in the section).
- **Services page rhythm:** the design has 70 px between sections — `margin-block-start` on the sections (on the last one also at the bottom), not inner padding.

## D34. Contact page: CF7 form in an atomic layout, form anchor, data from the design (2026-10-19)

The page was built autonomously per D32.

- **The form is a classic Shortcode widget inside an atomic card.** Free has no atomic form, and MCP doesn't create classic widgets. Our own WP-CLI command `wp aiec shortcode-widget <page> <parent> '<shortcode>' [--css-classes=…] [--replace] --user=admin` (`docker/wp-cli-commands.php`) adds the widget to the document's elements through the Elementor API, like Nav Menu in the header (D18). Subsequent MCP builds don't overwrite the widget (verified). The parent is the card's e-flexbox; `--replace` removes the previous shortcode widget so re-running doesn't create copies.
- **CF7 form template — custom markup** ("label — field — hint" blocks with `aiec-form__*` classes), styles — SCSS `widgets/_contact-form` based on the kit's tokens. A copy of the template — `elementor/forms/contact.txt` (the form itself lives in the database, post 40).
- **CF7 auto-paragraphs are turned off** (`wpcf7_autop_or_not` → false, `theme/inc/contact-form.php`): otherwise `<p>` and `<br>` around the fields added 250 px to the card.
- **The CF7 submit spinner** takes up space even when hidden (`visibility: hidden`) — we show it (`display: block`) only on a form in the `submitting` state. The response message is styled with selectors longer than CF7's (`.wpcf7 form .wpcf7-response-output`), otherwise its colors and spacing override ours.
- **Form errors are orange** (`color-secondary` for the border, `color-secondary-text` for the text): the palette has no red (D17).
- **All conversion buttons on the site → `/contact/#contact-form`** (Get Started in the header, the heroes, CTA, pricing; the user's decision on G3 — "later, to the form anchor"). The anchor is the form card's `id` (`_cssid`); the theme's `scroll-padding-top` keeps it below the sticky header (`base/_scroll`, 96 px).
- **Data from the design:** the second address in C3 in the design is a real company's details (name, registration, directors' names) → replaced with a neutral address of the same place as on the map. Social links — the Facebook / Instagram / LinkedIn home pages (placeholders until real profiles), opening in a new tab. Phone and email — from the design, as `tel:` and `mailto:` links.
- **h2 size on breakpoints:** the kit's h2 has its own sizes for tablet and phone, and a local size set only for desktop gets overridden by them on narrow screens. Small headings (22/28 in C2 and C3) get a size on every breakpoint.
- **Fix 2026-11-02: C2 and C3 within C1's frame** (user feedback): the design stretches them almost full-screen — we gave them the same width as the hero (`max-width`, centered, edges aligned with the hero's text and photo); details — `sections.md`. **MCP trap:** `padding` and `margin` in V4 are one property for all four sides, and updating one side (`padding-inline-end`, `margin-inline-start: auto`) wipes the others (`margin-block-start: 70` and the left margin disappeared). Set spacing for all sides at once and verify the styles after the update (`get-page-structure` with `include_content`).
- **Elementor MCP unavailable in a session** (the site was down when the session started): the server can't be reconnected from inside the session — only via `/mcp`. Workaround — the same JSON-RPC calls made directly to the endpoint with the credentials from the local config (`~/.claude.json`, not printed to the output); likewise Playwright — via a script on `playwright-core` from the npx cache with the installed Chrome.

## D35. Exporting Elementor to git (stage 5.4, 2026-11-10)

- **The `npm run wp:export` command** (`wp aiec export`, `docker/wp-cli-commands.php`; the `elementor/` folder is mounted into the `cli` container) splits the export into folders: `kit/` — the standard kit export, unpacked; `design-system/` — classes, variables and Default Styles via the Elementor REST API; `templates/` — each page and site part in the Templates → Import format. What's where and how to restore it — `elementor/README.md`.
- **The kit export in Elementor 4.3.5 Free doesn't include the V4 design system:** no global classes, variables or Default Styles. Pages reference classes by ID (Contact has 100 such references), so the kit alone gives pages without class styles. That's why the design system is exported separately. The kit has no images either (pages reference attachments by ID).
- **The standard export generates new random element IDs on every run** (and adds empty `isInner`/`settings`) — hundreds of lines of noise in git. Our export contains elements as they are stored in the database; export timestamps are removed. Re-exporting without changes produces an empty diff (verified). Import doesn't suffer from this: Elementor regenerates IDs on import anyway — the `contact.json` template was verified by importing it into the library (77 widgets, the form in place; the test copy was deleted).
- **A full restore is only possible from a backup** of the database and media library (`wp:backup` / `wp:restore`): the export in `elementor/` is for change history and for moving individual pages. Importing the design system isn't supported out of the box — we'll write a command when moving to another site (stage 6).
- **The style guide** (page 59, `/style-guide-internal/`) is included in the export — the user's decision.

## D36. Company contacts — SCF fields and the Company Info widget (stage 5.4, 2026-11-10)

- **Why:** the client edits the phone, email, addresses and social links in one place in the admin, and they change everywhere (Contact C2 and C3, the footer on all pages). Verified: a changed phone number appeared on three pages.
- **The fields are in the theme code** (`theme/inc/company-info.php`, `acf_add_local_field_group`): an SCF settings page "Company Info" (`acf_add_options_page` — available in SCF 6.9.6, as is the repeater). Fields: phone (as displayed) and dial number (international, for `tel:`), email, addresses (repeater: the address and an optional German spelling — for the German pages, D37), social links (repeater: network from a list + URL). The values are site options, shared across languages.
- **The `Company Info` widget** (`theme/widgets/company-info.php`, classic — MCP creates neither classic nor custom atomic widgets): one widget — one item (phone / email / social links / addresses), so the spacing between items stays with the Elementor containers. Addresses — "all" or "first only", marker icon on/off; font, color, gap and address width are Style tab settings (in C3 the width is 299 / 600, as before; in the footer its own font size and the `color-heading` color). The email is output via `antispambot()`, the icons are inline SVG from `assets/images/icons/` (sources in `src/images/icons/`), the network name is the link's `aria-label`.
- **Insertion — with `wp aiec widget <page> <type> --replace=<ID,…> --settings=<json>`**: the widget takes the place of the atomic elements (in their shared container), through the Elementor document API. Replaced: C2 — phone, email, social links; C3 — both addresses with one widget; footer — address, phone, email.
- **The appearance didn't change:** pixel comparison of before/after screenshots at 1440 / 768 / 375 — 0 changed pixels in C3 and the footer, 2 in C2 (anti-aliasing). Styles — `src/scss/widgets/_company-info.scss` (they mirror the `link-underline` class, the icons and the C3 addresses).

## D37. German version — Polylang Free (stage 5.4, 2026-11-10)

- **Languages:** English is the default, without a prefix; German — `/de/`. The German home page is at `/de/` (the Polylang option "home page URL = language code", `redirect_lang`). The switcher is a Polylang menu item in both Primary menus: it shows only the other language, by its name ("Deutsch" on English pages, "English" on German ones; the user's decision — as a menu item). In the footer columns (Menu List) the switcher is hidden.
- **Pages and site parts are German copies** with their own slugs (in Polylang Free, translations have different slugs): Startseite `startseite` (227), Leistungen `leistungen` (230), Kontakt `kontakt` (233), Header (DE) `header-de` (236), Footer (DE) `footer-de` (239). A copy has the same Elementor elements (element IDs are preserved, including the IDs of local styles); then the texts and links were translated via MCP (`manage-elements`, 131 edits). The theme finds a site part by the English slug and takes its translation (`pll_get_post`, `theme/inc/site-parts.php`); Site Parts are always translatable (the `pll_get_post_types` filter).
- **Menus:** "Primary (DE)" (16) and "Footer Resources (DE)" (17); the header menu location is assigned per language (the Polylang option `nav_menus`), the footer menus — in the Menu List widget settings of the German footer. **Form:** a second CF7 form "Kontakt" (252) — German labels, hints and messages; the German Kontakt page uses its shortcode. **Scripts:** the screen-reader labels of the sliders follow `<html lang>` (`src/js/modules/i18n.js`). **Company data** is shared; the address has an optional German spelling (D36).
- **Not translated:** placeholders (Lorem ipsum, the kit's Latin text), names and prices; image alt texts (shared: Polylang Free doesn't translate media); the admin notification email from the form. The style guide is English only. The translation for review — `design/translation-de.md`.
- **Important for further work:** the English and German pages are **separate documents**: a layout edit on one doesn't carry over to the other — it has to be repeated on both (or the page copied and translated again).
- **Traps when configuring from WP-CLI:**
  - rewrite rules rebuilt from WP-CLI don't include the language rules — after adding languages, delete the `rewrite_rules` option (WordPress rebuilds it on a normal request);
  - Polylang caches the language list (`pll_languages_list`) together with each language's home page — once the home page translations exist, delete this transient;
  - saving an Elementor document (`$document->save()`) from WP-CLI resets Polylang's translation links — link the translations (`pll_save_post_translations`) **after** saving;
  - take the new CF7 form's shortcode from the form re-read after saving (`get_instance()`), otherwise its ID is empty.
- **Verified:** all pages in both languages at 1440 / 1024 / 768 / 375 without horizontal scrolling; the switcher leads to the paired page; `lang` and `hreflang` are set; both forms — messages in their own language, emails in Mailpit; the German documents open in the Elementor editor (language `de-DE`, no placeholders).

## D38. Elementor 4.4.0; Elementor pages open straight in Elementor (2026-11-10)

- **The WordPress block editor shows a white canvas on Elementor pages.** Elementor's script hides the blocks and inserts its own "Edit with Elementor" placeholder into `.block-editor-writing-flow` or `.is-desktop-preview` of the admin document — WordPress 7.1.4's markup (the canvas is in an iframe) doesn't have them, so the placeholder has nowhere to go. WordPress auto-updated 7.1.3 → 7.1.4 on November 1; most likely the markup changed then. **The user's decision:** don't fix it — open Elementor pages straight in Elementor (the "Edit with Elementor" link in the page list or the button at the top of the editor). Regular WordPress pages edit normally.
- **Elementor updated 4.3.5 → 4.4.0** (the user's decision). Procedure: a backup; screenshots of all pages in both languages and the style guide at 1440 / 768 / 375 before and after (with "reduce motion"; two "before" runs matched to the pixel — no noise); `wp elementor update db`; CSS cache flush. **Result:** 21 screenshots — 0 changed pixels; the animations, testimonial carousel, FAQ, burger and editor (pages, site parts, German copies, the Company Info widget) work; no JS errors.
- **MCP after the update:** 33 tools instead of 20 — the new ones include media upload (`elementor-upload-media`; previously images were uploaded only via WP-CLI), revisions and rollback of MCP edits, cache flush (`elementor-clear-cache`), icon search, experiments and system info. `elementor-get-widget-schema` was renamed to `elementor-get-widget-schemas`. A Claude Code session sees the new tools after `/mcp` → Reconnect.
- **The MCP server is stricter about the protocol:** after `initialize`, every request must carry the `MCP-Protocol-Version` header. Claude Code sends it; your own scripts that call the endpoint directly must send it too.
- **Warning in the PHP log:** Elementor 4.4.0 loads the MCP adapter as a bundled copy, while WordPress recommends the separate MCP Adapter plugin ("may not be supported in future versions"). It works for now; switching to the plugin is a separate decision if the warning becomes an error.
- **Export:** `_edit_lock` markers are removed from the kit XML (they change every time a page is opened in the editor).

## D39. Plugin updates: CF7 6.2.5, Polylang 3.9.2, SCF 6.9.8 (2026-11-11)

- **The user's decision:** update. The same procedure as for Elementor (D38): backup `20261111-000350`, two "before" screenshot runs (matched to the pixel), the update, "after" screenshots. **Result:** 21 screenshots — 0 changed pixels, except 2–4 anti-aliasing pixels of the ✨ icon (a WordPress emoji) on the home page — not caused by the plugins.
- **What we checked in the changelogs:** Polylang 3.9 reworked the flags (PNG → SVG) — our switcher has no flags, and the screenshots didn't change; SCF 6.9.8 tightened saving (only the fields shown on screen are saved, and only for matching field groups) — the Company Info page saves, the values are the same; CF7 6.2.5 requires PHP 8.3 and WordPress 7.1 — we have them.
- **Verified:** both forms (hints, error, submission — messages in their own language), the language switcher leads to the paired pages, the Polylang, menu and CF7 admin screens show no errors, the Elementor editor (English and German pages), saving Company Info.
- **Minor detail:** after saving Company Info from the browser, line breaks in the addresses are stored as `\r\n` (that's how the browser sends any textarea field), previously as `\n` (filled in from WP-CLI). It doesn't affect the output — the screenshots matched.

## D40. Real copy instead of the kit's placeholders (2026-11-13)

- **The user's decision:** replace the lorem with proper text; testimonials get made-up names and companies. Placeholders were in almost every section, not only in the FAQ: 93 places on the English pages (Home 27, Services 49, Contact 17; 33 unique texts) plus the same places on the German copies. Also replaced: "Name" / "Company" in four testimonials, the identical quote "Utilize our insights…" and the titles "Features 1–3" on Services.
- **The texts** are written for the company Legite (cryptocurrency tax), at roughly the same length as the placeholders so the design's layout doesn't shift. English and German — by the agent; the source keyed to element IDs — `tools/copy-texts.cjs`, a table for review — `design/translation-de.md`. The FAQs on Services (about the services) and on Contact (about getting in touch and the first consultation) are different. The names in the testimonials are made up; the companies are made-up names without "&" (an ampersand in atomic text wasn't tested).
- **Applied with** Elementor MCP `manage-elements`, 288 edits across six documents (an English page and its German copy have identical element IDs), then publish and CSS cache flush. The style guide wasn't touched — the lorem there is a type specimen.
- **Verified:** no placeholders left in the HTML (except the form field label "Name"); 6 pages × 7 widths — no horizontal scrolling and no overflowing text (the fixed-height "Insights" cards — the text fits inside); overview sheets at 1440 and 375. The home page height at 1440 — 8394, the same as the Figma frame.

## D41. SEO — Yoast SEO Free (2026-11-13)

- **The user's decision:** Yoast SEO (28.8). Elementor Free has no SEO title and description fields; Yoast is the most common SEO plugin on client sites, integrates into the Elementor editor and works with Polylang. Alternatives — Rank Math, custom SCF fields.
- **Site title:** "AI Elem Practice" → **Legite** (it appears in every page's title and in the structured data), tagline — "Crypto Tax Services" (German — "Krypto-Steuerberatung", Polylang strings).
- **Page meta tags** — in each page's Yoast fields: title `<text> %%sep%% %%sitename%%` ("… - Legite", up to 60 characters) and description (up to 155). The source with the EN and DE texts — `tools/seo-meta.cjs`. The client edits them in the **"Yoast SEO" tab of the Elementor panel** (next to Widgets / Components / Globals; it works in Elementor 4.4, and the values are visible).
- **Link previews (Open Graph):** a screenshot of the home page's first screen at 1440, scaled down to 1200 × 630 (JPEG) — English (attachment 276) and German (277), set explicitly on each page: otherwise Yoast takes the page's first image (on Contact — the hero photo in WebP, which not all social networks display). **The logo in the organization markup** — a PNG 600 × 183 (278): an SVG has no dimensions, so Yoast won't use it. Sources — `design/assets/seo/` (not in git).
- **What's hidden from search:** author and date archives (there's a single author), site parts (`aiec_part`) and Elementor templates — noindex and no Yoast panel; the style guide — noindex. The default "Sample Page" — in the trash. The sitemap (`/sitemap_index.xml`) lists six pages in both languages; "Hello world!" and the Uncategorized category will go away with the blog build.
- **Polylang + Yoast** (Polylang's built-in integration): `og:locale` and `og:locale:alternate` per language, `hreflang` — from Polylang, German URLs in the sitemap.
- **Structured data:** the Yoast graph (WebPage, BreadcrumbList, WebSite, Organization) and the FAQPage from the Elementor accordion — separate blocks, no duplicates.
- **Traps:**
  - **on a local site Yoast doesn't build its index** (`WP_ENVIRONMENT_TYPE=local` — `wp yoast index` refuses to run); the meta tags are still output. On the live site after migration — `wp yoast index`;
  - **`wp rewrite flush` from WP-CLI loses Polylang's language URLs** (D37) — instead, delete the `rewrite_rules` option and WordPress rebuilds it on a normal request (that's what was done; all URLs return 200).
- **Verified:** title, description, canonical, robots, Open Graph, hreflang and structured data on all pages in both languages; the sitemap; the Yoast tab in the Elementor editor without JS errors; before/after screenshots — the layout didn't change.

## D42. Video in "How It works" — our own clip in `e-self-hosted-video` (2026-11-13)

- **The user's decision:** the section has to work; any available clip will do (an AI-generated one is fine).
- **Source — Coverr** ("A broker works with a cryptocurrency candlestick chart", 1080p, 14 s, no sound). The Coverr license: free for commercial and personal projects, websites and client work allowed, no attribution required; you may not resell the files themselves or train AI on them (premium clips — subscription only; this one isn't premium). **Ruled out:** Mixkit — almost all relevant clips there are under the "Stock Video Restricted License" (personal non-commercial projects only; the license is stated per clip); Pexels and Pixabay return 403 to a script. The agent has no way to generate a clip itself (and generating one through Figma would spend the paid Figma account's credits). There are no third-party logos in the frame.
- **Build:** the atomic `e-self-hosted-video` (added in Elementor 4.4) inside the black block: full area, `object-fit: cover`, `object-position: 50% 30%` (on desktop the 1312 : 548 block is wider than the 16 : 9 frame — the monitor with the chart stays in frame); `preload: none`, no poster — before a click the block looks exactly as in the design, and the clip (8.3 MB) isn't loaded. File — `design/assets/home/how-it-works-video.mp4` (not in git), attachment 280; the `moov` index is at the start of the file, so it plays before it's fully loaded.
- **Button:** the white circle from the design — the global class `video-play`, the block — `video-player` (both provide `position` for the overlay; the behavior comes from the theme). The script `src/js/modules/video-player.js` turns the circle into a button (`role="button"`, a label in the page's language — `i18n.js`, Enter and Space), and on press enables the native controls and starts the clip; at the end — the cover again, with focus on the button. Without the script and in the Elementor editor, the native video controls work (the circle lets clicks through).
- **Fix (user feedback): pause when off-screen** — `IntersectionObserver`: less than a quarter of the block visible — pause; when the block comes back, it resumes only if the pause was caused by scrolling; full screen and picture-in-picture aren't affected.
- **MCP traps:** `max-width: none` and `object-position: center 30%` aren't accepted (`max-width: 100%` and `50% 30%` are). `build-composition` / `manage-elements` edits reach the site only after `publish-document`.
- **Verified:** 1440 / 768 (German, started from the keyboard) / 375 — before a click 0 video requests, after it — it plays, the button is hidden, focus is on the video; at the end of the clip — the cover and focus on the button; before/after screenshots of all pages — 0 changed pixels; the editor for both home pages — no errors.

## D43. Anchor navigation: smooth scrolling only after the visitor's first interaction (2026-11-13)

- **What happened:** a link to a section from another page (`/#innovation`, `/#how-it-works`, `/contact/#contact-form` — where all the "Get Started" buttons lead) stopped short of the target in about half the cases: by up to 261 px on a phone and 124 px on desktop; on the Contact form — consistently 122 instead of 96 px from the top. Found through repeated runs (5 visits per anchor); the single check during the Contact build happened to hit a lucky case.
- **Cause:** `html { scroll-behavior: smooth }` is set **by Elementor itself** (`custom-frontend.css`, under `prefers-reduced-motion: no-preference`), so navigation from another page was smooth too: the browser computed the destination while Quicksand was still loading, and the font swap changed the height of the text above the target. During smooth scrolling the browser doesn't correct the position.
- **Solution:** until the first click, touch or key press, scrolling is instant (`html:not(.smooth-scroll) { scroll-behavior: auto }` — overrides Elementor's rule); the `smooth-scroll` class is added by `src/js/modules/smooth-scroll.js` on the first interaction. Navigation from another page goes straight to the target, and the browser keeps it in place while the font finishes loading; clicks on anchors within a page are smooth (the click itself is the first interaction). Ruled out: "enable smoothness after `load`" (the browser jumps to the anchor after `load` — smoothly again) and "correct the position with a script" (conflicts with the browser's own jump — overshoot).
- **Verified:** 6 anchors × 5 visits (1440 / 768 / 375, both languages) — 30 out of 30 exactly 96 px below the header; clicks on "Discover Our Innovation" and "back to top" — smooth; page screenshots — unchanged.
- **Along the way:** the "Insights" section was missing the `#insights` anchor that the footer link points to — added on both home pages; the video got the `#how-it-works` anchor.

## D44. About Us and blog: assessment accepted, About Us built (2026-11-14)

- **Assessment** — `design/assessment-about-blog.md`; the user accepted all recommendations: team portraits — from the kit; article images — frames from Coverr clips with a purple tint; the article grid — 3 columns; sidebar filters — real ones (search + categories); A4 on About — company values; order — About Us, then the blog, each page in full per D32.
- **Finished sections are carried over by copying elements** through the document API (`get_elements_data` → `save`); element IDs are preserved (they're unique within a document), then the copies are edited via MCP. The German copy is made the same way; texts of sections already translated on the German pages carry over by the same IDs.
- **The "About Us" / "Über uns" menu items** are now page items (they used to be `#` links): `wp menu item add-post` at the same position + removing the old item.
- **The "Why you Choose us" zigzag** isn't a new section but H8 with different desktop styles (the track absolutely centered, the steps alternating at the edges); at ≤1024 it's the same as on the home page, so the step order in the markup and for screen readers doesn't change.
- **Team** — global classes `team-*` (the styling of the four cards is edited in one place) and a phone strip on the shared `slider-dots.js`.
- **The low-resolution trophy from the kit** (source 600 × 343, the trophy itself 207 × 242) — shown smaller than in the design.
- **Button links are relative** (`/contact/#contact-form`), as on the other pages: absolute `http://localhost…` links would break on migration.

## D45. Blog on Elementor Free: templates in Site Parts and custom data widgets (2026-11-14)

- **The archive and post templates are Site Parts**, like the header and footer (D18): "blog-archive" (blog, categories, tags, search) and "blog-post" (article), built in Elementor via MCP. The theme swaps the template (`template_include` → `template-parts/blog.php`) if a part exists for that kind of page; otherwise Hello's templates are used. The part's styles are declared together with the header and footer. Free has no Theme Builder, and no dynamic tags for atomic elements either.
- **Post data — five custom classic widgets** (MCP doesn't create custom widgets; they're inserted with `wp aiec widget` in place of placeholders): Post Grid (the current query with pagination, or the latest posts), Archive Title, Post Header, Post Content, Blog Sidebar. Card and pagination markup — `theme/inc/blog.php`. In the Elementor editor of a part, the widgets show the latest posts in the part's language, so the template isn't empty.
- **Posts are written in the WordPress block editor** (it works for posts; the white canvas from D38 affects only Elementor pages); text formatting comes from the theme styles.
- **Sidebar filters are real** (search across posts with `post_type=post`, categories); the design's non-functional fields weren't built. Grid — 3 columns (the user's decision, D44).
- **Theme strings in German** — `theme/languages/de_DE.po`; the file is named after the locale (`load_child_theme_textdomain()` looks for `de_DE.mo`, not `ai-elem-child-de_DE.mo` — the first attempt didn't load). Build: `wp i18n make-mo` and `make-php` in the container.
- **Menu:** on a post and in a category, WordPress gives the "Blog" item only the `current_page_parent` class — the theme adds `aria-current="true"` to it so the highlight works.
- **Minor details:** "Uncategorized" became the "Tax" category (the default category can't be deleted), and the empty German "uncategorized-de" from Polylang was deleted; the "Hello world!" post is in the trash; comments on posts are closed (a theme filter + settings); the admin's display name is "Legite Team": Yoast outputs the author in the article's structured data, and the `admin` login was showing there; the blog wrapper has no `site-main` class — Hello limits its width on non-Elementor pages.
- **MCP pitfall:** the breakpoint in styles is `--tablet_extra` (with an underscore); `--tablet-extra` is rejected, and the element's entire style along with it.
