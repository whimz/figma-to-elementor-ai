# Elementor export

Elementor layouts live in the WordPress database. This folder holds a file copy of them, so the change history is in git and individual pages can be moved to another site.

To refresh the export (the site must be running): `npm run wp:export`. Re-exporting without changes on the site produces an empty `git diff`.

## What's where

| Folder | Contents | Source |
|---|---|---|
| `kit/` | The Elementor kit export, unpacked: site settings (`site-settings.json`), pages (`content/page/<ID>.json`), header and footer (`content/aiec_part/`), WordPress menus and posts (`wp-content/*.xml`), `manifest.json` | `wp elementor kit export` |
| `design-system/` | The V4 design system, which the kit export lacks: global classes (`global-classes.json`, in editor order), variables (`variables.json`), Default Styles h1–h4 and p (`default-styles.json`) | Elementor REST API |
| `templates/` | Every page and site part as a separate template: `home`, `services`, `contact`, `style-guide-internal` (style guide), `part-header`, `part-footer`; the German version — `startseite`, `leistungen`, `kontakt`, `part-header-de`, `part-footer-de` (decisions.md D37) | The document's stored elements |
| `forms/` | The Contact Form 7 "Contact" form template (a copy; the form lives in the database, post 40) | By hand, see decisions.md D34 |

Page elements are exported exactly as they are stored in the database. The built-in Elementor export differs only in that it generates new random IDs for all elements on every export. On import, IDs are regenerated anyway.

## How to restore

- **The whole site:** from the database and media library backup, `npm run wp:restore -- <time>` (backups are made by `npm run wp:backup` and stored in `backups/`, not in git). This is the only complete method: only the backup has the images, attachment IDs and plugin data.
- **A single page on another site:** Templates → Import → a file from `templates/`. Tested by importing `contact.json` into the library. The new site needs the same design system (classes and variables with the same IDs, otherwise the page loads without their styles), the images in the media library, and the child theme.
- **The kit:** Elementor's built-in export format. To import it, zip the contents of `kit/` and upload the archive via Elementor → Tools → Import / Export Kit. Kit import hasn't been tested yet.

**Importing the design system** (`design-system/`) isn't supported by Elementor out of the box. There's no command for it yet: it will be needed when moving to another site (Stage 6 of the plan).
