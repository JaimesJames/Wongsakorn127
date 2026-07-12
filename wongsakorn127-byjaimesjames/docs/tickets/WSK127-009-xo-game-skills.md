# WSK127-009 [Full] XO game special mechanics (skills/cards)

- Kanban: https://github.com/JaimesJames/Wongsakorn127/issues/44
- Status: In Progress
- Branch: feature/WSK127-009-xo-game-skills

## Acceptance Criteria
- [x] "Enable skills" checkbox on the board-size selection screen (off by default).
- [x] Skills-disabled mode behaves exactly like WSK127-008.
- [x] Skills-enabled mode: each player gets one Block charge and one Remove charge.
  - [x] Block: target an empty, unblocked cell; blocked for exactly 2 turns (opponent's
        next turn, then the blocker's next turn), then free again.
  - [x] Remove: target a cell holding the opponent's mark; clears it.
- [x] Using a skill consumes the turn (no mark placed that turn).
- [x] Skill selection UI with per-skill charge count, disabled once spent, and a cancel
      action.
- [x] Blocked cells show a lock marker and reject placement.
- [x] Skills unavailable once the game has a winner or is a draw.
- [x] Unit tests for all of the above (skills-disabled parity, block timing/expiry,
      block rejects placement, remove valid/invalid targets, charge exhaustion, cancel,
      skills disabled after game end).
- [x] Manually verified in browser (see Test plan).

## Design notes / decisions
- Simplified deliberately from the original Ducky Lucky reference (action-point economy
  + card hand + random board-effect slots) down to two always-available, single-use
  skills on top of plain alternating turns — confirmed with the user in chat.
- Block duration counts turns via a per-cell `blockedTurnsRemaining` counter, decremented
  once per turn for every block *except* the one just placed that same turn (so a fresh
  block isn't immediately ticked down in the turn it's created). This gives the intended
  "opponent's turn + placer's next turn" duration exactly.
- Board special-effect slots and additional skills remain out of scope — future tickets.

## Test plan
- `npm run test:ci` — 96/96 passing.
- `npm run build` — passing.
- Manual verification in browser using the real component instance (`ng.getComponent`)
  to read authoritative state after each interaction (page-text snapshots were
  occasionally stale in the sandboxed browser, so state was double-checked this way):
  - Block: placed on cell 4, confirmed locked marker + disabled button, confirmed
    rejection while blocked for both the opponent's and the placer's next turn, confirmed
    it unblocks and becomes placeable exactly after those 2 turns.
  - Remove: confirmed rejecting a target that's the acting player's own mark (charge and
    turn unchanged), then confirmed removing the opponent's actual mark works (board
    cleared, charge decremented, turn passed).
  - Skills-disabled mode: confirmed no skill UI renders and play proceeds identically to
    WSK127-008.
