# WSK127-006 [UxUi/FE] Shared shell for title/nav/profile

- Kanban: https://github.com/JaimesJames/Wongsakorn127/issues/39
- Status: In Progress
- Branch: feature/WSK127-006-shared-shell

## Acceptance Criteria
- [x] New `ShellComponent` (`core/layout/shell/`) renders `CreditBadgeComponent` at one
      consistent position/spacing shared by every page.
- [x] `ShellComponent` accepts `contentAlign: 'top' | 'center'` (default `'top'`).
- [x] `ShellComponent` accepts `isLight`, passed through to `CreditBadgeComponent`.
- [x] `home`, `nosygame`, `kingleegame` migrated to `<app-shell>`; top spacing identical
      (verified: 200px badge offset on all three).
- [x] `auth` migrated to `<app-shell contentAlign="center">`; centered layout preserved
      (verified: form vertically centered).
- [x] Unit tests for `ShellComponent` cover both alignment variants and `isLight`.
- [x] Layout contract doc added (`docs/shell-layout-contract.md`).

## Design notes / decisions
- `spinitgame` could not match the 200px offset used by the other four pages without
  clipping its fixed-height wheel layout — see the "Known exception" section in
  `docs/shell-layout-contract.md`. Kept at a smaller offset (~160px) with its wheel-sizing
  CSS constants adjusted accordingly. Decision confirmed with the user in chat.
- `home`'s dead `isLoading`-driven padding branch (always `false`, never toggled) was
  removed as part of the migration since the shell now owns that spacing.
- `nosygame` used `overflow-y-scroll` (always-reserved scrollbar gutter) while
  `kingleegame` used `overflow-hidden` (no gutter), which shifted the now-identical
  vertical positions ~7.5px apart horizontally once vertical spacing matched exactly.
  Fixed by switching `nosygame` to `overflow-y-auto` with `scrollbar-gutter: stable
  both-edges`, so both pages reserve symmetric gutter regardless of whether a scrollbar
  is actually shown.

## Test plan
- `npm run test:ci` — 62/62 passing.
- `npm run build` — passing.
- Manual verification in browser for all 5 pages: title position, no clipping/overflow
  (checked at 1280x720 and 375x812), auth centering preserved, spin-it wheel fits both
  desktop and mobile viewports without functional regressions.
