# Portfolio: materials for Upwork (stage 6)

Prepared on 2026-11-14 from the local site. After the move to a subdomain, the shots can be retaken from the live URL (see "How to rebuild"). Nothing has been published: the user posts to Upwork and GitHub.

## Files (`design/portfolio/`, not in git)

| File | What it is |
|------|---------|
| `01-cover.png` | project cover: the site in a browser window and on a phone, 2000 × 1500 (4 : 3) |
| `02-figma-vs-site.png` | the Figma design and the site side by side |
| `03-responsive.png` | three phone screens: home, Services, blog |
| `04-blog.png` | blog: the post list and a post on a phone |
| `05-editor.png` | the Elementor editor: V4 elements, global classes, named layers |
| `06-languages.png` | the English and German versions |
| `process-video.mp4` | process video "design → agent → finished page", 50 s, 1920 × 1080, H.264, 33 MB |
| `raw/` | source shots: every page in full and the first screen on desktop (1440) and phone (390, retina) |

Upwork's requirements differ from source to source ([Upwork Portfolio Guide](https://www.upwork.com/resources/portfolio-guide), [field limits](https://snipework.com/blog/upwork-portfolio-character-limit)): cover — at least 1000 px wide (ours is 2000 × 1500), title — safe up to 40 characters, description — up to 300 (some sources say 600). Hence the two description variants below. Full-size page shots taller than 4000 px are for a personal site or Behance; on Upwork the 01–06 gallery works better.

## Copy for the Upwork portfolio project

**Title** (37 characters; the alternative is also 37):
> Figma to WordPress: Elementor V4 + AI

> AI-First Elementor Website from Figma

**Your role** (77):
> WordPress developer: Elementor V4 build, custom widgets, AI-assisted workflow

**Project description — short** (273, fits within 300):
> Rebuilt a Figma UI kit as a 6-page WordPress site on Elementor V4 (Free) with an AI-first workflow: Claude Code built real Elementor elements via Elementor MCP and checked every section against the design. Responsive, English + German, blog, SEO, all editable in Elementor.

**Project description — full** (484, if the field accepts 600; it ends with the kit author attribution required by the CC BY license):
> Figma UI kit → WordPress on Elementor V4 (Free) and a Hello child theme, built AI-first. Claude Code read the design via Figma MCP, built real Elementor V4 elements with global classes via Elementor MCP, and checked every section against Figma on desktop, tablet and mobile. Mobile layouts designed during the build. 8 custom Elementor widgets, a blog without Elementor Pro, contact form, English + German, Yoast SEO, layout exported to Git. Design: Sego (Figma Community, CC BY 4.0).

With the short description, the attribution stays in the final frame of the video; if the video isn't uploaded, add the line "Design: Sego (Figma Community, CC BY 4.0)" to the description.

**Skills** (up to 5): WordPress · Elementor · Figma to WordPress · Responsive Design · WordPress Multilingual (Polylang)

**Project URL:** the subdomain address — after the move.

**Media order:** 01-cover (cover) → process-video → 02 → 05 → 03 → 04 → 06.

## AI-process line for proposals

Full (299 characters):
> I work AI-first: Claude Code reads your Figma file, builds real Elementor elements (global classes, no HTML blocks) through Elementor MCP and checks every section against the design on desktop, tablet and mobile before I hand it over. You get an editable site faster, and I still own every decision.

Short (164):
> I build Elementor sites AI-first: Figma to editable Elementor pages via Claude Code + Elementor MCP, every section checked against the design on three screen sizes.

## Numbers you can quote (verified against the project)

- **6 page types** (Home, About Us, Services, Contact, post list, single post) **× 2 languages**; 36 sections in the tracker, all accepted.
- **8 custom Elementor widgets:** Nav Menu, Menu List, Company Info, Post Grid, Archive Title, Post Header, Post Content, Blog Sidebar.
- **Design system:** 55 global classes, 22 variables, Default Styles.
- **45 recorded decisions** (`docs/decisions.md`), an AI-process log (`docs/workflow-log.md`).
- **Time:** about 35 hours from an empty folder to a finished site with a blog and two languages, including environment setup and documentation — estimated from the log, partly checked against commits. A repeat page built from existing recipes — about 25 minutes.
- **The user made no manual edits to the layout**: decisions at forks and review — the human; execution and self-check — the agent.

## How to rebuild

Scripts — `tools/portfolio/` (Playwright from the `@playwright/mcp` cache; the path can be set in `PLAYWRIGHT_CORE`):

```bash
node tools/portfolio/capture.cjs          # shots → design/portfolio/raw/
node tools/portfolio/compose.cjs          # gallery 01–06
node tools/portfolio/record-video.cjs     # video (≈50 s in real time); "frames" — control frames only
```

After the move — shots from the live site: `SITE_URL=https://<subdomain> WP_USER=… WP_PASS=… node tools/portfolio/capture.cjs` (a login is needed for the editor shot). Chrome records the video itself (MediaRecorder, MP4 / H.264); no separate ffmpeg is needed.
