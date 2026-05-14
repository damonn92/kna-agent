# KNA Agent v0.4.0 Design Source

Source-of-truth artboards exported from **claude.ai/design**, project
[KNA Agent v0.4.0 — 7-Page App Redesign](https://claude.ai/design/p/019e2335-2e81-7429-b95f-4e8eecd40306).

## Files

- `colors_and_type.css` — KNA Design System tokens (coral/cream palette,
  Source Serif 4 + Inter, spacing scale, shadows, radii). Imported
  into `src/styles/globals.css` as the v0.4.0 visual baseline.
- `app.css` — shared utility classes (`.kna-app`, `.kna-sb`,
  `.kna-tbar`, `.kna-bal`, …). Components in `src/pages/*` will
  migrate onto these classes over the v0.4.x patch cycle.
- `app-shell.jsx` — reference React shell (TitleBar + Sidebar + frame
  wrapper + lucide-style icon set). Used as a structural reference
  when restyling `src/components/layout/{Sidebar,MainLayout}.tsx`.
- `pages/*.jsx` — 14 hi-fi frames (2 per page × 7 pages) showing the
  target visual + interaction for each route. Used as a frame-by-frame
  spec when porting each `src/pages/<name>` to the new design.
- `design-canvas.jsx` + `index.html` — Claude Design canvas wrapper.
  Not used in production; kept for cross-reference with the live URL.
- `assets/` — coral K logo, payment marks (Alipay + WeChat).

## Roadmap

| Phase | Scope | Status |
|---|---|---|
| 1 | Tokens + app.css + shadcn HSL remap | v0.4.0-alpha.1 |
| 2 | Sidebar + MainLayout restyle | next |
| 3 | Chat page (4,204 lines) | next |
| 4-8 | Models / Agents / Channels / Skills / Cron / Settings | one per PR |
| 9 | Cleanup + v0.4.0 final | after all 7 ported |

Not for production use directly — pure design reference + extracted
tokens. Components in `src/` are the source of truth for shipped code.
