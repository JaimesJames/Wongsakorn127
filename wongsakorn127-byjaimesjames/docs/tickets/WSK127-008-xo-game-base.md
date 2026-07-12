# WSK127-008 [Full] XO game (base, no skills)

- Kanban: https://github.com/JaimesJames/Wongsakorn127/issues/43
- Status: In Progress
- Branch: feature/WSK127-008-xo-game-base

## Acceptance Criteria
- [x] New route `/xo-game` (`feature/xoGame/`), using `ShellComponent`.
- [x] Player can choose board size before starting a match: 3x3, 4x4, or 5x5.
- [x] Two players alternate turns (X and O) on the same device — no login required.
- [x] Win condition: `min(boardSize, 5)` marks in a row, any of the 4 directions.
- [x] Draw detected when the board fills with no winner.
- [x] UI shows current turn, announces winner/draw, "play again" and "change size".
- [x] Added to bottom navigation (text badge "XO" — no custom artwork yet, see notes).
- [x] Unit tests cover win detection across all 3 sizes and all directions, plus draw.
- [x] Manually verified in browser: 3x3 win, 4x4 win (confirms 3-in-a-row does NOT win on
      a 4x4 board), size selector, no title/content overlap.

## Design notes / decisions
- Win-length rule (`min(boardSize, 5)`, Gomoku-style) and size range (3-5) confirmed with
  the user in chat.
- Win detection logic lives in a pure, framework-free function
  (`xogame-win-checker.ts`) for easy, fast unit testing — same pattern worth reusing for
  future game logic.
- No custom badge artwork exists yet; used a plain "XO" text badge on `bg-xo-game`
  (new theme color, `#FF6B4A`) instead of blocking on an image asset. Swap for real
  artwork later — this is explicitly a UX/UI design space, so the visual polish pass is
  expected as its own follow-up, not scope creep on this ticket.
- Named `xo-game` for now; may be renamed to `duckylucky` once the full feature set
  (including skills, see WSK127-009) is built out, per a prior class project the user
  built the original concept for (https://github.com/SutheeraP/duckylucky — Next.js/
  Firebase, referenced for design ideas only, not ported directly).

## Test plan
- `npm run test:ci` — 88/88 passing.
- `npm run build` — passing.
- Manual verification in browser: played a 3x3 match to an X win, a 4x4 match to an X win
  (confirming the win-length scales correctly), verified the size-selection and
  in-progress screens don't overlap the global title (gap ~22px, consistent with other
  pages).
