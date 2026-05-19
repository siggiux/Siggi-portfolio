# Siggi UX Portfolio — Full Project Summary

---

## Person
Siggi — aspiring UX designer, Hyper Island grad, ex-marketing background, co-founded Hot Tickets (a last-minute tourism marketplace in Iceland). Building a portfolio to land a UX role in Berlin.

---

## Site Structure

```
/
├── index.html               — homepage with project cards
├── case-study-1.html        — Hot Tickets operator portal (built)
├── case-study-2.html        — not built yet
├── about.html               — not built yet
├── tokens.css               — design variables (colors, spacing, type)
├── style.css                — global styles
├── components.css           — nav, footer, cursor, dark mode toggle
├── case-study.css           — case study page layout and section styles
├── viewer.css               — design viewer component styles
├── viewer.js                — design viewer component logic
├── script.js                — dark mode toggle, custom cursor, accordion, TOC scroll tracking
└── images/
    ├── case-study-1/
    │   ├── hero.png
    │   ├── thumbnail.png
    │   ├── desktop/
    │   │   ├── light/       — desktop screens, light mode (1440×900px)
    │   │   └── dark/        — desktop screens, dark mode (1440×900px)
    │   ├── mobile/
    │   │   ├── light/       — mobile screens, light mode (390×844px)
    │   │   └── dark/        — mobile screens, dark mode (390×844px)
    │   └── design and discount flow/
    │       ├── ideation.png
    │       ├── task-flow.png
    │       ├── user-flow.png
    │       ├── lo-fi-wireframes.png
    │       └── hi-fi-wireframes.png
    └── case-study-2/        — not populated yet
```

---

## Design Direction

### Typography
- Font: `Familjen Grotesk` (Google Fonts)
- `700` for headings, `400` for body
- Letter spacing `-2px` on hero `h1`, `-1px` on section titles

### Colors
All stored as CSS variables in `tokens.css`:

| Variable | Light | Dark |
|---|---|---|
| `--color-bg` | `#ffffff` | `#111110` |
| `--color-bg-2` | `#f5f5f5` | `#1a1a18` |
| `--color-text-1` | `#1a1a1a` | `#f0efea` |
| `--color-text-2` | `#6b6b6b` | `#999892` |
| `--color-text-3` | `#a0a0a0` | `#555450` |
| `--color-border` | `#e8e8e8` | `#2a2a28` |
| `--color-accent` | `#dd2f20` | `#dd2f20` |
| `--color-btn-hover` | `#e2e1df` | `#2a2a28` |
| `--color-goals` | `#2d9e6b` | `#2d9e6b` |

### Visual Direction
Editorial minimalism. References: yourwave.nl, plat4m.com, matthewdea.com. Work-first, minimal decoration.

### Dark Mode
Toggled via `body.dark` class, persisted in `localStorage`. Moon/sun icon swap in nav.

---

## Homepage Decisions
- Full-width stacked cards with `--color-accent` red background
- Card height `520px`, `border-radius: 20px`
- Blur and zoom hover effect on card image
- Custom cursor pill showing "View project" on card hover
- Card title grows from `26px` to `48px` on hover
- Tags fade in on hover
- Max width `1200px`, padding `0 48px`
- Footer — `Siggi — UX Designer` left, `2026` right
- Favicon — inline SVG red circle

---

## Case Study Page Decisions

### Layout
- `.page--case-study` — `max-width: 1000px`, `padding: 0 80px 80px`
- Hero section (label, h1, subtitle, meta row) — full content width
- Hero image — `aspect-ratio: 16/9`, `border-radius: 12px`, `width: 100%`
- Below hero: single content column, full width (~840px effective)
- TOC — `position: absolute`, `left: -240px` from content column, `width: 200px`
  - Inner element (`toc-inner`) is `position: sticky; top: 48px`
  - Hides below `1200px` viewport width
- Section dividers — `0.5px solid var(--color-border)`
- Section padding — `64px 0`

### Case Study 1 — 9 Sections (8 built)

| # | ID | Title | Status |
|---|---|---|---|
| 1 | `overview` | An operator portal for last-minute discount management | ✅ Real content |
| 2 | `preview` | A first look at the operator portal | ✅ Design viewer |
| 3 | `brief` | Why Hot Tickets needed its own portal | ✅ Real content |
| 4 | `research` | Understanding the domain before designing | ✅ Accordion |
| 5 | `scoping` | Choosing where to go deep | ✅ Real content |
| 6 | `insight` | Operators already know how they want to discount | ✅ Pull quotes |
| 7 | `flow` | From insight to interface | ✅ Scroll strip |
| 8 | `designs` | The discount flow | ✅ Design viewer + callouts |
| 9 | `outcome` | Outcome & reflection | ❌ Not built yet |

### CSS Components in case-study.css
- `.cs-section` — section wrapper, `padding: 64px 0`
- `.cs-section-title` — section heading, `clamp(24px, 3vw, 40px)`
- `.cs-body` — body text column, `max-width: 680px`, `color: text-2`
- `.cs-goals` — two-column goals/constraints grid
- `.cs-goals-list` — goal items with `→` arrow prefix (green for goals, red for constraints)
- `.cs-accordion` — research accordion, one open at a time
- `.cs-quote` — pull quote with red left border, large type
- `.cs-strip` — horizontal scroll strip, breaks out of content column with `-80px` negative margin
- `.cs-strip-item` — `width: 420px`, `flex: 0 0 auto`, image + figcaption
- `.cs-image-placeholder` — dashed border placeholder, `height: 360px`

---

## Design Viewer Component

### Files
- `viewer.css` — all styles namespaced under `.design-viewer`
- `viewer.js` — auto-init component, wrapped in IIFE

### How it works
Drop a `.design-viewer` div with data attributes anywhere on a page. `viewer.js` finds every `.design-viewer` on `DOMContentLoaded` and builds the full UI inside it. Multiple viewers per page are supported — each has independent state.

### Data attributes
```html
<div class="design-viewer"
  data-base="images/case-study-1"
  data-desktop-light="01-light-filename,02-light-filename"
  data-desktop-dark="01-dark-filename,02-dark-filename"
  data-mobile-light="01-light-screen,02-light-screen"
  data-mobile-dark="01-dark-screen,02-dark-screen">
</div>
```

Filenames are comma-separated, no extension (`.png` is appended automatically). Images are looked up at:
`{data-base}/desktop/light/{filename}.png`
`{data-base}/desktop/dark/{filename}.png`
`{data-base}/mobile/light/{filename}.png`
`{data-base}/mobile/dark/{filename}.png`

### Callout data — important
Callout JSON cannot be placed directly in HTML attributes because quote escaping breaks `JSON.parse`. Instead, set callout data via an inline `<script>` tag immediately after the viewer div:

```html
<div class="design-viewer" id="viewer-designs" data-base="..." ...></div>
<script>
(function () {
  var el = document.getElementById('viewer-designs');
  el.setAttribute('data-callouts-desktop', JSON.stringify([
    {label:'Label here', text:'Text here', second_label:'Optional', second_text:'Optional'},
    {label:'Single callout', text:'No second callout needed'}
  ]));
  el.setAttribute('data-callouts-mobile', JSON.stringify([
    {label:'Mobile group 1', text:'Covers screens 1-3'}
  ]));
})();
</script>
```

Desktop callouts: one object per screen. Mobile callouts: one object per group of 3 screens.

### Viewer features
- Desktop / Mobile toggle — animated sliding pill
- Light / Dark mode toggle — same sliding pill animation
- Arrow navigation with SVG icons, directional nudge on hover
- Screen counter (`1 / 8` format)
- Fullscreen button — bottom-right of stage, inline with callouts
- Fullscreen overlay toggles — appear in top corners in fullscreen
- Callout strip — sits below arrows, inline with fullscreen button
- Responsive — below 768px: mobile view shows 1 phone instead of 3
- Light stage (dark mode designs) — all controls recolor for contrast

### CSS class naming
All classes prefixed with `dv-`. Key classes:
- `.dv-stage` — the dark/light background container
- `.dv-controls` — controls bar above stage
- `.dv-group` — toggle pill group
- `.dv-btn` — individual toggle button
- `.dv-desktop-view` / `.dv-mobile-view`
- `.dv-phone` / `.dv-phone-screen`
- `.dv-nav` — arrow row
- `.dv-arrow` — individual arrow button
- `.dv-bottom-row` — wraps callout strip + fullscreen button in one flex row
- `.dv-callout-strip` — callout container (flex, hides when empty via `:empty`)
- `.dv-callout` — individual callout card
- `.dv-callout-num` — blue numbered badge
- `.dv-fs-btn` — fullscreen toggle button
- `.dv-fs-overlay` — overlay toggles shown in fullscreen

### Image export specs
- Desktop: export Figma frames at **1440×900px** (16:10), PNG, 1x
- Mobile: export Figma frames at **390×844px** (9:19.5), PNG, 1x
- Consistent dimensions are critical — the viewer uses `aspect-ratio` so mismatched sizes show differently

### Known open issues
- Fullscreen layout still needs tuning — image sizing vs available viewport height
- Dark mode screenshots in `mobile/dark/` are auto-generated placeholders (Pillow), not real Figma exports
- Section 9 (Outcome & reflection) not built yet

---

## Technical Decisions
- Plain HTML, CSS, JS — no frameworks, no build tools
- Hosted on GitHub Pages — `siggiux.github.io/Siggi-portfolio`
- Workflow: VS Code → GitHub Desktop → push → live
- Font: Google Fonts via `<link>` in `<head>`
- No CMS — content written directly in HTML
- `script.js` handles: dark mode toggle, custom cursor, accordion (`toggleAccordion`), TOC Intersection Observer
- `viewer.js` is separate from `script.js` — loaded independently at bottom of `<body>`
- Commit strategy: commit per logical unit of work

### Avoiding duplication across case studies
- Content lives in each case study HTML file directly
- Template comment block marks what to change when duplicating for CS2/CS3
- Future plan: migrate to Astro or Eleventy when portfolio is live (content moves to `.md` files)

---

## Open / Undecided
- [ ] Fix fullscreen viewer image sizing (move to Claude Code)
- [ ] Export correct Figma dimensions — desktop 1440×900px, mobile 390×844px
- [ ] Design real dark mode screens in Figma (current dark versions are auto-generated)
- [ ] Add system map image to case study 1 section 5
- [ ] Write section 9 — Outcome & reflection
- [ ] Build `about.html`
- [ ] Build `case-study-2.html`
- [ ] Add about and contact sections to homepage
- [ ] Logo — placeholder in designs, real logo not designed yet
- [ ] Eventually migrate to static site generator (Astro/Eleventy)