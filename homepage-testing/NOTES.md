# Homepage exploration — working notes

> **✅ RESOLVED — V3 (Quiet) won and graduated to the repo root on 3 Aug 2026.**
> The live site is now: `index.html` (V3 homepage), `about.html`,
> `case-study-1/2/3.html`, chrome in `site.css` + `site.js` (renamed from
> v3-site.*), card designs in `/cards/`, card media in `/images/cards/`.
> This directory is the **archive of the exploration** — v1–v4 still render
> (they reference the root's shared `../cards/` and `../images/cards/`), but
> the root files are canonical. Don't edit anything here expecting it to
> affect the live site.

**Run it:** `npx serve` from the repo root, then open
`http://localhost:3000/homepage-testing/` (the version index).
The pages need to be served over HTTP — opening the `.html` files directly
breaks the relative paths to `../tokens.css`, `../cards/` and `test-images/`.

---

## The problem being solved

The hero is a drifting 3D deck of cards mixing **case studies**, **education**
and **work experience**. Visitors assume everything in a portfolio deck is a
project, so each version tries a different way of signposting that it's a mix.

## Versions

| File | Name | The idea |
|---|---|---|
| `v1-drifting-deck.html` | Drifting deck | Baseline. Big cards, small "Siggi Design" wordmark, no explainer. |
| `v2-editorial.html` | Editorial | Big uppercase wordmark, explainer with coloured category chips inline, smaller cards. |
| `v3-quiet.html` | Quiet | **Most developed.** Big wordmark, small muted explainer (no colour), solid black button, uppercase UI, responsive. |
| `v4-statement.html` | Statement | Small wordmark again, explainer promoted to a big headline. |

`archive/` holds four earlier explorations from July that predate this direction.

**V3 is the furthest along** — it has the responsive work, the sun/moon toggle
and the nav. The others are earlier forks and lack those.

## The site family (now at the repo root)

The V3 look is one family across `index.html`, `about.html` and the three
case-study pages — all at the root since graduation.

- **`site.css`** — the shared chrome: Geist, grain overlay, wordmark header +
  uppercase nav + segmented theme toggle + mobile menu, footer, chips,
  sharp-corner overrides. Loads AFTER `tokens.css` / `case-study.css` /
  `viewer.css` — order matters, it's an override skin.
- **`site.js`** — theme toggle, mobile menu, reveal, accordion, TOC.
  Replaces the old `script.js` on these pages (the old toggleTheme expects
  moon/sun icon markup this design doesn't have — don't include both).
- Case studies still use `case-study.css` (+ `viewer.css` / `viewer.js` for
  CS1) for structure; `site.css` only reskins.
- CS3's inline styles/JS hold only the page-specific bits (live embeds,
  laptop chassis, carousels, fitter).
- Sharp corners rule has two deliberate exceptions: hardware chassis
  (CS2 phone frame, CS3 laptop lid) keep their rounding.
- Case-study heroes use a yellow `.chip--cs` kicker; the about page carries
  green/blue chips on the Experience/Education sections — same colours as
  the homepage card tags.
- The old skin files (`style.css`, `components.css`, `about.css`,
  `script.js`) are no longer used by the main pages — kept only for
  `viewer-sandbox.html` / history. Candidates for deletion.

## Shared vs per-version

- **Shared across all versions:** `cards/*.css` (one file per card design),
  `test-images/`, `../tokens.css`. Editing a card's CSS changes every version.
- **Per-version:** everything in each file's inline `<style>` — layout, type
  scale, nav, spacing.

If a card needs to differ between versions, scope it rather than editing the
shared file.

## Case-study cover images — one folder, three names

Each case study's artwork lives in `images/case-study-N/` and serves three
surfaces via standard filenames:

| File | Surface | Shape / size |
|---|---|---|
| `hero.jpg` | case-study page cover | wide, ≤2400px, JPEG q80 (~250–360K) |
| `card.png` / `card.jpg` | homepage deck card | portrait ~3:4, ~750px wide — jpg for photographic art, png for flat art; the deck markup references the exact filename |
| `thumb.jpg` | "Latest work" grid | landscape 4:3, 1200×900 JPEG (derived from hero) |

The original full-res hero PNGs (up to 6.9MB) are recoverable from git
history. To regenerate from a new full-res source:
`sips --resampleWidth 2400 -s format jpeg -s formatOptions 80 source.png --out hero.jpg`
`sips --resampleHeight 900 hero.jpg --out thumb.jpg && sips -c 900 1200 thumb.jpg`

**The live site uses these canonical paths.** The old copies in
`test-images/` (`cs2.png`, `cs3.png`, `unsplash_MQ8EFPUt4Zw.png`) are still
referenced by the archived v1/v2/v4. `images/case-study-3/hero-homepage.jpg`
is only referenced by `archive/v4-framer-cards.html` now — delete both
whenever the archive stops being worth keeping.

## Card workbench

`/cards/workbench.html` (at the root, next to the card CSS) renders one card
large for design work. Use `#hyper-island`, `#msc`, `#bsc`, `#cs1`, `#cs2`,
`#cs3`, `#hot-tickets`, `#datera`. It **fetches card markup from
`homepage-testing/v1-drifting-deck.html`** — if card content changes on the
live homepage, v1 won't reflect it; update the fetch path (or v1) when the
cards get their redesign pass.

## Conventions worth keeping

- **Card content is authored in the markup**, not generated by JS. (It used to
  be built by script, which meant the workbench showed cards with no hover text.)
- **Category chips:** case study `#f5d90a` yellow · education `#1e3aff` blue ·
  work `#16e34f` green. Filter buttons take the matching colour on hover.
- **Sharp corners everywhere** — no border-radius in the system.
- **Easing:** `cubic-bezier(0.22, 1, 0.36, 1)` for UI motion, so things feel
  like one family.
- **Card shadows** use `box-shadow`, never `filter: drop-shadow` — the filter
  version pooled into a visible grey haze behind the row.
- **Videos** as card backgrounds are fine (`<video autoplay muted loop
  playsinline class="card-front-bg">`); JS sets `playbackRate = 0.5`.

## Gotchas already hit (don't re-discover these)

- **Dark mode is `body.dark`**, defined in `tokens.css`. Putting the class on
  `<html>` silently does nothing. Fixed in all four versions.
- **`.corner` sets `z-index: 10`**, which creates a stacking context. A fixed
  overlay inside a corner gets trapped under sibling corners — V3 lifts
  `.corner-tr` to 60 while the mobile menu is open.
- **`ch` units resolve against the element's own font-size.** Setting a `ch`
  max-width on a parent squeezes a larger child unexpectedly.
- **The card track's vertical padding must stay symmetric.** Asymmetric padding
  (added to stop the stage mask clipping shadows) pushed the deck off-centre.
- **The carousel is JS-driven** and relies on `requestAnimationFrame`, which
  browsers suspend when a tab is hidden. There's a timer fallback so it can't
  freeze.
- **Filter clicks are queued**, not dropped, during the ~3s deck animation —
  dropping them made buttons feel like they needed a double-click.
- **Don't `setPointerCapture` on pointerdown** in the drag-to-scroll code —
  with capture active, the browser delivers the click to the stage instead
  of the card links, so none of them navigate. Capture only after the
  pointer moves ≥6px (fixed on the live homepage; the archived versions
  here still have the bug).

## Open threads

- Card designs are done for ALL cards as of 4 Aug 2026: hyper-island
  (caustics video), msc (ribbon video + RU mark), bsc (static gradient + RU
  mark), datera (brick), hot-tickets (hillside photo), and cs1/cs2/cs3
  (photographic product-in-scene art in `images/case-study-N/card.jpg`).
  cs2's crop is art-directed in `cards/cs2.css` (landscape source).
- **Images were bulk-optimized Aug 3 2026** (heroes → JPEG ≤2400w, portrait
  640w, CS2 screenshots 800w JPEG, wireframes ≤1600w, below-fold imgs lazy).
  Keep new images inside these budgets.
- The two videos (~3.4MB) are still the single heaviest thing on the V3
  homepage. `avconvert` makes them BIGGER (fixed-bitrate presets — confirmed
  again). Needs `brew install ffmpeg`, then: CRF ~28, scale to ≤720px tall,
  and ideally cut msc-bg's 30s loop to ~8s.
- Responsive work has only been done on **V3**.
- Nothing here is committed to git yet.
