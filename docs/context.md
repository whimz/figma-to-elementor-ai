# Context: why this project exists

Written 2026-10-03 after a Claude Code session (2026-10-02 — 2026-10-03).

## 1. Upwork launched an MCP server

- On 10 August 2026, Upwork released an official MCP server: `https://mcp.upwork.com/mcp`, OAuth sign-in, free of charge.
- Through it, an AI assistant (Claude Code and others) searches jobs, reads the profile, messages and contracts, and drafts proposals and profile edits. Every change is shown as a preview first and then confirmed by the user. Connects are charged only when a proposal submission is confirmed.

## 2. What the job-market analysis showed (2026-10-02, ~40 recent jobs matching the profile)

1. **Elementor dominates.** About 2/3 of the jobs are Figma → WordPress on Elementor, often with requirements like "global styles", "reusable/global templates", "so our team can edit afterwards".
2. **Almost all of them ask for 2–3 links to live sites.** The portfolio is the main bottleneck right now.
3. **An "AI-first" niche has appeared.** Some jobs explicitly require Claude Code, Figma → code and an AI-driven development process (example: an Irish agency is looking for an "AI-First WordPress Developer" and asks candidates to describe how AI has changed their process). Competition there is high (50+ proposals), but the clients are large.
4. **Budgets:** fixed price is usually $100–800, hourly $15–30.
5. Common tasks: Figma → WordPress, finishing and "polishing" existing sites, speed (Core Web Vitals), migrations, WooCommerce, SEO implementation.

## 3. A new opportunity: Elementor MCP

- On 23 September 2026, Elementor officially released its own MCP: Claude Code / Codex / Cursor build pages from **real Elementor elements** (containers, widgets, styles, global classes and variables); the result is editable in the visual editor and saved as a draft.
- Together with Figma MCP, this enables a "design → the agent builds the page → a human reviews and fixes the details" process, with no manual building in the editor.
- Limitations: it works only with V4 atomic elements (Elementor 4.3+, according to reviews); the tool is brand new, so its real-world quality has to be tested in practice.

## 4. Project goal

1. Master the **Figma MCP + Elementor MCP + Claude Code** stack on a local WordPress install — to take on Elementor jobs (2/3 of the market) as quickly as custom-theme jobs.
2. Get a **portfolio piece**: a page/site built from a design with an AI-first process.
3. Collect **material for proposals** in `workflow-log.md`: how the AI process works, what it speeds up, where a human is needed — with numbers.
