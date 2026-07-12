# Shell layout contract

`ShellComponent` (`src/app/core/layout/shell/`) owns the title/brand region every page
must use instead of placing `CreditBadgeComponent` and top spacing by hand.

## Regions

1. **Title spot** — `CreditBadgeComponent` ("Wongsakorn127 / by JaimesJames"), rendered
   by the shell at a fixed position.
2. **Content** — projected via `<ng-content>`, positioned by the `contentAlign` input.
3. **Navigation** and **profile menu** stay global (`NavigatorComponent`, `HeadComponent`
   in `app.component.html`), unchanged by this ticket — they already render on every
   route.

## Inputs

- `isLight: boolean` (default `false`) — passed through to `CreditBadgeComponent` for
  light/dark text color, matching each page's background.
- `contentAlign: 'top' | 'center'` (default `'top'`):
  - `'top'`: content starts directly below the title, offset by `pt-40` (matches the
    space the global fixed header/profile button needs).
  - `'center'`: content is vertically centered in the space below the title (used by
    `auth`, whose login/register forms are a centered-form pattern, not a top-anchored
    game screen).

## Usage

```html
<main class="w-screen h-screen ... flex flex-col">
  <app-shell [isLight]="true">
    <!-- page content -->
  </app-shell>
</main>
```

The page's own `<main>` keeps its background, overflow, and decorative elements — the
shell only standardizes the title position and content alignment.

## Known exception: `spinit-page`

`spinitgame` has a fixed-height (`100dvh`, `overflow: hidden`), pixel-budgeted layout
(the wheel's size is computed from remaining viewport height). Matching the other pages'
full `pt-40` + `p-10` top offset (200px) did not fit this page's budget — the wheel hit
its minimum size and content still clipped. This page keeps a smaller effective top
offset (shell's `pt-40` alone, no extra page padding, ~160px) instead of matching the
other pages pixel-for-pixel, and its wheel-sizing CSS constants were adjusted to reflect
the reduced budget. If this page's UI is reworked in the future, revisit whether it can
absorb the full standard offset.
