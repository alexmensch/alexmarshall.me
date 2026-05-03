# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
pnpm run build           # Format, lint, test, build site
pnpm run build:cf        # Full build + R2 sync (for Workers Builds)
pnpm run deploy          # build:cf + wrangler deploy (manual deployment)
pnpm run 11ty:watch      # Dev server with hot reload
pnpm run 11ty:debug      # Dev server with Eleventy debug output
pnpm run clean           # Remove _site directory
pnpm test                # Run tests (Node.js built-in test runner)
```

### Linting

```bash
pnpm run lint            # Run all linters (JS, CSS, Markdown)
pnpm run lint:js         # ESLint
pnpm run lint:css        # Stylelint for SCSS/CSS
pnpm run lint:md         # markdownlint-cli2
pnpm run lint:fix        # Auto-fix JS and CSS issues
pnpm run format          # Prettier formatting
```

### Favicons

Favicons are generated from a font glyph using `scripts/generate-favicons.js`. The script extracts the "A" glyph from Inter Bold, centers it, and produces all favicon variants.

```bash
node scripts/generate-favicons.js  # Regenerate all favicon files
```

- Font source: `src/_build/fonts/Inter-Bold.ttf`
- Change `FONT_PATH` in the script to use a different typeface
- Dev dependencies: `sharp`, `png-to-ico`, `opentype.js`
- Generated files (in `src/`): `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `favicon-192.png`, `favicon-512.png`
- `favicon.svg` adapts to light/dark mode via CSS media query
- `site.webmanifest` references the 192 and 512 PNG variants
- Favicon `<link>` elements are defined in `src/_data/site.js` under `site.links`

## Architecture

This is an Eleventy static site using Liquid templates, deployed to Cloudflare Workers with static assets and R2 for audio files. It is a counselling-focused fork of alxm.me, sharing the same SCSS architecture and KV-sourced writing collection.

### Key Files

- `.eleventy.js` - Main Eleventy config: plugins, filters, shortcodes, Sass processing
- `src/_build/markdown.js` - Configured markdown-it instance with all plugins (footnotes, smart arrows, external links)
- `src/_build/shortcodes.js` - Shortcode functions (articleImage, blockQuote)
- `src/_data/site.js` - Site configuration, navigation structure
- `src/_data/helpers.js` - Shared utility functions (slugify, date formatting, etc.)

### Directory Structure

- `src/` - Source content (Markdown pages, templates, assets)
- `src/_includes/layouts/` - Page layouts (Liquid)
- `src/_includes/partials/` - Reusable components
- `src/_data/` - Global data files
- `src/assets/scss/` - Styles organized by CUBE CSS methodology
- `worker/` - Cloudflare Worker (serves static assets, R2 files)
- `_cloudflare/r2/` - R2 sync scripts (uploads large files to R2)
- `tests/` - Test suite (Node.js built-in test runner, `node:test` + `assert/strict`)

### SCSS Structure (CUBE CSS)

Styles use CUBE CSS methodology with Utopia fluid typography:

- `global/` - Reset, variables, base styles
- `config/` - Design tokens, fonts, Sass helpers
- `compositions/` - Layout primitives (flow, stack, grid, sidebar, etc.)
- `blocks/` - Component-specific styles
- `utilities/` - Single-purpose utility classes

### Writing Section

Writing articles come from Cloudflare KV (shared with alxm.me). Only psychology-tagged articles are rendered, controlled by `pagination.before` in `src/writing/writing.11tydata.js`. All writing articles have `<link rel="canonical">` pointing to their alxm.me URL (computed in `writing.11tydata.js`).

The writing listing page (`src/_includes/partials/article.liquid`) also filters by `item.tags contains "psychology"` for display.

### Cloudflare Integration

**Worker** (`worker/index.js`):

- Serves static assets from `_site/` via Workers static assets
- Proxies audio files from R2 with MIME detection and range request support
- Adds `TDM-Reservation: 1` header to HTML responses (W3C TDM Protocol opt-out)
- Configuration in `wrangler.toml` at project root

**R2 Sync** (`_cloudflare/r2/`):

- Syncs `src/assets/files/` (guided journey MP3s) to `alexmarshall-assets` R2 bucket
- Runs as part of `build:cf` command
- To test audio locally: `cp -r src/assets/files _site/assets/`

**Other**:

- KV stores writing collection items
- Environment variables required in `.env` for Cloudflare API access

### Custom Shortcodes (`src/_build/shortcodes.js`)

- `{% articleImage src, alt, ratio, portrait, href %}` - Inline article images (ratio is required)
- `{% blockQuote %}content{% endblockQuote name, source, url %}` - Block quotes with attribution

### Custom Filters

- `getLinkActiveState` - Navigation active state
- `markdownify` - Render Markdown inline
- `dateToRfc3339`, `getNewestCollectionItemDate` - Date formatting

### Newsletter Subscribe Form

The subscribe form integrates with [feedmail](https://github.com/alexmensch/feedmail) at `newsletter.alxm.me`.

**Files:**

- `src/_includes/partials/subscribe-form.liquid` - Form with AJAX submission
- `src/assets/scss/blocks/_subscribe-form.scss` - Form styles (CUBE CSS conventions)
- `src/_data/site.js` - `site.newsletter` config (apiUrl, channelId)

**How it works:**

- Form POSTs to `https://newsletter.alxm.me/api/subscribe` with email and channelId
- The form renders on writing article pages (where `subscription: true`)
- feedmail handles verification emails, subscriber management, and feed-to-email delivery independently


<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:ca08a54f -->
## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

### Rules

- Use `bd` for ALL task tracking — do NOT use TodoWrite, TaskCreate, or markdown TODO lists
- Run `bd prime` for detailed command reference and session close protocol
- Use `bd remember` for persistent knowledge — do NOT use MEMORY.md files

## Session Completion

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd dolt push
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
<!-- END BEADS INTEGRATION -->
