# WSK127-007 [UxUi/FE] Animate title position between page navigations

- Kanban: https://github.com/JaimesJames/Wongsakorn127/issues/41
- Status: In Progress
- Branch: feature/WSK127-007-title-slide-animation

## Acceptance Criteria
- [x] `CreditBadgeComponent` is rendered once, globally, in `app.component.html`.
- [x] `ShellLayoutService` exposes the current top offset / `isLight` / `visible` state as
      a signal; each top-anchored page's `ShellComponent` sets it via `titleOffsetPx` and
      `isLight` inputs on init/change.
- [x] The global title transitions smoothly (`transition: top 300ms`) when the target
      offset changes between top-anchored pages.
- [x] Page content reserves enough top space to clear the title, which is no longer part
      of local document flow (fixed regression: initial version kept the WSK127-006
      `pt-40`, which only cleared the title's *starting* position, not its full height —
      content rendered overlapping the title on nosygame, kingleegame, and spin-it until
      the user screenshotted it and caught it. Bumped local reservation to `pt-[260px]`,
      which accounts for the title's own height (~78px) and gap it used to get "for free"
      as a flex sibling).
- [x] `auth` (`contentAlign="center"`) keeps its own local, non-animated title; the global
      title hides (`opacity-0`, `pointer-events-none`) while on such pages.
- [x] Unit tests cover `ShellLayoutService` and `ShellComponent`'s calls into it.
- [x] Manually verified in browser: `Router.navigateByUrl` between kingleegame (200px) and
      spin-it (160px) updates the single persistent title element's target correctly in
      both directions; auth correctly shows only its own local badge with the global one
      hidden.

## Design notes / decisions
- Used Angular's classic `@Input()` + `ngOnChanges` (not signal inputs) to match the rest
  of the codebase's style in `ShellComponent`.
- `ShellComponent` no longer renders `CreditBadgeComponent` itself for `contentAlign="top"`
  — only for `"center"`, since the global element in `app.component.html` handles the
  top-anchored case for every page at once.

## Test plan
- `npm run test:ci` — 69/69 passing.
- `npm run build` — passing.
- Manual verification in browser via `Router.navigateByUrl` (more reliable than clicking
  the bottom-sheet nav link in the sandboxed browser): confirmed the persistent title
  element's `top` and the `ShellLayoutService` target update correctly across kingleegame
  <-> spin-it navigation, and that auth hides the global title while showing its own.
- User-provided screenshots caught a real content/title overlap regression on nosygame,
  kingleegame, and spin-it (not visible to automated geometry checks alone). Fixed and
  re-verified via geometry (title-bottom-to-content-top gap, ~60px+ on every page) plus a
  second round of user screenshots confirming no overlap.
