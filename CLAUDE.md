# AI + WordPress + Elementor — practice project

A learning/practice project: master the **Figma MCP + Elementor MCP + Claude Code** stack on a local
WordPress and turn the result into an Upwork portfolio piece.

## Read at the start of a session

1. [docs/context.md](docs/context.md) — why this project exists (Upwork MCP, job-post analysis, conclusions).
2. [docs/decisions.md](docs/decisions.md) — which decisions were made and why (Elementor + MCP, Hello child theme, Gulp, Docker Compose, deployment, licenses).
3. [docs/plan.md](docs/plan.md) — the stage plan. The current stage is the first one with unchecked items.
4. [docs/workflow-log.md](docs/workflow-log.md) — the AI process log; keep adding to it as you work.

## How to work: analysis first, then execution

The user asked: don't jump straight into a task — analyze it first.

1. **Analysis without changes.** Before any stage or non-trivial task, don't create or change anything. First:
   - re-read the relevant section of `docs/plan.md` and the related decisions in `docs/decisions.md`;
   - check the current state: which files already exist, what is installed, which versions, what is running;
   - if the task involves external tools (Elementor MCP, Docker, npm packages), verify their current behavior instead of relying on memory.
2. **Plan for approval.** Briefly show the user:
   - what exactly will be done and in what order;
   - which files will be created or changed;
   - which decisions are made along the way (and why), if they are not in `decisions.md`;
   - risks, deviations from the plan, and questions.
3. **Execute only after confirmation.** If it turns out along the way that the plan doesn't work or you need to deviate from `decisions.md`, stop and ask — don't improvise.
4. **Report after each step:** what was done, what was checked and how, what's left. Add new decisions to `decisions.md`.

Exception: small obvious fixes (a typo, a single line on direct request) can be made right away.

### Build flow (Stage 5; details in plan.md and decisions.md D12)

1. **Initial assessment of all designs** — no building; output: `design/assessment.md`, `design/mobile-spec.md`, `design/sections.md`. Signed off by the user.
2. **Foundation** — Elementor global styles, decisions on the header/footer and the form. Signed off by the user.
3. **Cycle for each section:** link → analysis → proposals (including tablet and mobile) → start work only after a "yes" → review against the checklist — first a self-check via Playwright MCP (screenshots at the design width, 768 and 375, compared with Figma), then hand over to the user with screenshots. After sign-off: status in `sections.md`, an entry in `workflow-log.md`, a commit.

One section at a time. Don't move on to the next one until the current one is accepted.

## Rules

- Talk to the user in Russian; code comments in English. Documentation in this public repository is in English.
- Theme code goes only in `theme/` (that's what ships to the site). Style/script/image sources go in `src/`; the Gulp build outputs to `theme/assets/`.
- Elementor layouts live in the database. Everything that needs versioning is exported to `elementor/` (kit, templates as JSON). DB dumps go to `backups/` (not in git).
- Never commit secrets. Elementor MCP access (application password) is added only via `claude mcp add --scope local`. `.mcp.json` holds only servers without secrets (Figma, OAuth).
- This is a practice site, not a client one: publish pages and Site Parts right after building them, without asking separately (the user's decision of 2026-10-18). On client projects — drafts, published after review.
- Record in `docs/workflow-log.md` what the AI did on its own, what had to be fixed by hand and how long it took. This is material for Upwork proposals.
- Check off completed items in `docs/plan.md` and commit when a logical step is complete.

## Environment

- Windows 11, VS Code, Node 22 / npm 10, git, Gulp CLI 3, Docker Desktop with WSL2 (must be running for the local WordPress), Google Chrome (for Playwright).
- The user's Docker also runs **working containers of other projects** — don't stop or remove them, don't run `docker system prune`. Touch only this project's containers, volumes and images (compose project `ai-wp-elem`).
- Ports: 8888 — local WordPress (Apache listens on 8888 inside the container too, so loopback requests work), 8025 — Mailpit (all site mail); **3000 is taken by a work container** → browser-sync on 3100 (UI 3101).
- Free space (2026-10-05): C: ~55 GB, D: ~44 GB. WordPress, plugins and the database live in Docker volumes (not on the Windows disk: from there everything in the container is ~150× slower, decisions.md D5). The shared Docker disk (`docker_data.vhdx`) has been moved to D: (`D:\Docker\DockerDesktopWSL`, 2026-10-05).
- There is no PHP, Composer or WP-CLI locally — use the container: `npm run wp:cli -- <command>` (= `docker compose exec cli wp …`). Start/stop: `npm run wp:start` / `wp:stop`, fresh install: `npm run wp:setup`. PHP log: `docker compose exec wordpress cat /var/www/html/wp-content/debug.log`.
- Backup of the database and the media library: `npm run wp:backup` → `backups/<time>-db.sql.gz` and `-uploads.tar.gz` (not in git); restore — `npm run wp:restore -- <time>`. Make one before risky edits: the design system and Elementor layouts live in the database.
- Open Elementor pages straight in Elementor ("Edit with Elementor"): in the WordPress 7.1.4 block editor they show a white canvas — we don't fix that (decisions.md D38). Elementor 4.4.0.
- Company contacts (phone, email, addresses, social links) — the **Company Info** admin page (SCF fields in `theme/inc/company-info.php`); on the site they are output by the Company Info widget. To put a classic widget in place of atomic elements: `npm run wp:cli -- aiec widget <page> <type> --replace=<ID> --settings=<json> --user=admin` (decisions.md D36).
- **Two languages (Polylang, decisions.md D37):** English is the main language, German is at `/de/` (pages 227 / 230 / 233, Header (DE) 236, Footer (DE) 239, menus 16 / 17, CF7 form "Kontakt" 252). German pages are separate documents: repeat every layout edit on both. Translation — `design/translation-de.md`.
- SEO — **Yoast SEO** (decisions.md D41): page title and description — the "Yoast SEO" tab in the Elementor panel, meta tag texts — `tools/seo-meta.cjs`. On the local site Yoast doesn't build its index (`wp yoast index` — production only). Don't reset rewrite rules with `wp rewrite flush` — delete the `rewrite_rules` option instead (otherwise the `/de/` URLs disappear, D37).
- **Blog** (decisions.md D45): templates — Site Parts `blog-archive` / `blog-post` (the German ones are translations), data — theme widgets `post-grid`, `archive-title`, `post-header`, `post-content`, `blog-sidebar`; posts are written in the WordPress block editor, demo texts — `tools/blog-posts.cjs`. German theme strings — `theme/languages/de_DE.po` (after editing: `npm run wp:cli -- i18n make-mo wp-content/themes/ai-elem-child/languages` and `make-php`).
- Export of Elementor layouts and the design system to `elementor/` (for git): `npm run wp:export` — after layout changes, before committing (decisions.md D35, `elementor/README.md`).
- Images and SVGs into the media library: `npm run wp:import -- <path in design/assets> --title=… --alt=…` (SVGs are cleaned by the Elementor sanitizer). The header and footer are "Site Parts" posts (`aiec_part`, slugs `header`/`footer`), output by the child theme (decisions.md D18).
- If the site hangs from the host on `127.0.0.1:8888` but responds on `[::1]:8888`, the WSL relay is stuck — fix it by recreating the `wordpress` container (D18). If WP-CLI then reports "Error establishing a database connection" (`getaddrinfo for db failed`), recreate `cli` too: `docker compose up -d --force-recreate --wait cli`.
- npm runs scripts through Git Bash (`script-shell` in `~/.npmrc`): Git Bash turns arguments starting with `/` into Windows paths — set `MSYS_NO_PATHCONV=1` for such calls.
- Local WordPress: http://localhost:8888, admin at `/wp-admin` (admin / password — local Docker only; never reuse it on a public server).
- Figma MCP: remote server `https://mcp.figma.com/mcp` (OAuth, `.mcp.json`), a paid Figma team (Full seat): 200 calls a day, 10–15 a minute. Save what you extract from the design to `design/` so calls aren't spent again. Upwork MCP is connected at user scope.
- Elementor MCP: server `elementor` (`--scope local`, HTTP `http://localhost:8888/wp-json/elementor/mcp/` + Basic auth with an application password). VS Code runs the session under `d:\…`, while the CLI from the terminal writes the key `D:/…` — the local server is stored under both keys in `~/.claude.json` (decisions.md, D16). MCP doesn't upload images — use WP-CLI `wp media import`.
- Playwright MCP: `@playwright/mcp@0.0.83` in `.mcp.json` (installed Chrome, persistent profile, WordPress login saved) — screenshots and page checks; screenshots go to `design/screens/` (not in git).
