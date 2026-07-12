# WSK127-010 [Full] Bomb game (wasabi roulette, base)

- Kanban: https://github.com/JaimesJames/Wongsakorn127/issues/47
- Status: In Progress
- Branch: feature/WSK127-010-bomb-game-base

## Acceptance Criteria
- [x] New route `/bomb-game` (`feature/bombGame/`), using `ShellComponent`.
- [x] Setup screen: choose bombs-per-player (1 or 2) before starting.
- [x] Hand-off interstitial before each player's placement turn.
- [x] Placement screen: 10-cell pile shown as neutral; active player selects exactly N
      bombs before confirming; previously-placed bombs from the other player are
      indistinguishable from safe cells.
- [x] After both place, eating phase begins, visible to both; turns alternate (Player 1
      starts).
- [x] Safe pick reveals and passes the turn.
- [x] Bomb pick ends the game immediately, sets the loser, reveals remaining bombs.
- [x] "Play again" resets to the setup screen.
- [x] Unit tests: placement validation, overlapping bomb selections, safe pick,
      bomb pick + reveal, guaranteed resolution.
- [x] Manually verified in browser (see Test plan).

## Design notes / decisions
- Overlapping bomb selections between the two players are allowed and handled silently
  (the cell is simply a bomb either way) — confirmed as an acceptable simplification
  with the user rather than adding target-picking constraints.
- "Play again" always returns to the setup screen rather than replaying with the same
  settings, for simplicity (both were acceptable per the AC).
- No pure/standalone logic module this time (unlike the XO win-checker) — game state is
  simple enough that direct component-level tests were sufficient and match the style of
  the earlier, simpler games (kingleeGame).

## Test plan
- `npm run test:ci` — 111/111 passing.
- `npm run build` — passing.
- Manual verification in browser using `ng.getComponent` for authoritative state checks:
  - Full playthrough with 1 bomb/player: Player 1 places at index 3, hand-off to Player 2
    who sees an all-neutral pile (confirmed Player 1's bomb position is not visible),
    places at index 7, confirmed both bombs land in `bombs` correctly.
  - Eating phase: safe pick at index 0 reveals it and passes the turn; bomb pick at index
    3 ends the game, sets the correct loser, and reveals the remaining bomb at index 7.
  - No title/content overlap (gap ~22px, consistent with other pages).
