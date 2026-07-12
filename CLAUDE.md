# Wongsakorn127 — Working Rules

Personal UX/UI design space (Angular 21 SSR) for custom mini-games (Nosy Game, Kinglee Game, Spin It, ...). Owner: JaimesJames. These rules are durable and apply to every future task in this repo — follow them without being reminded.

## 1. Ticket-first

- No code changes without a GitHub Issue first. This is the hard requirement — the issue
  itself (title + AC) is what gates work starting, and only needs `repo` scope, which has
  never broken on this machine.
  - Title convention (existing, keep using it): `WSK127-XXX [Category] Short title` e.g. `WSK127-010 [UxUi/FE] Custom color panel for the wheel`
- Every ticket must have QA-able Acceptance Criteria (checklist or Given/When/Then) in the issue body before work starts.
- **Approval gate**: draft the ticket (title + AC) and show it in chat. Do not create the GitHub issue, and do not start implementation, until the user explicitly approves the AC in chat.
- **Kanban board is best-effort, not a gate**: also try to add/move the issue on
  https://github.com/users/JaimesJames/projects/1 (`Wongsakorn127byJaimesJames`, project
  number 1; columns `Todo` → `In Progress` → `Done`). The `project` scope on this
  machine's `gh` token has repeatedly reverted on its own — if adding/moving the card
  fails for that reason, skip it and keep working; do not block on `gh auth refresh` loops.
  Move to `Done` only after merge + doc update, when the board is reachable.

## 2. Tests + CI gate, no silent commits

- Every change ships with a test (unit at minimum; e2e/manual-verified for UI flows that can't be unit tested).
- Before proposing any commit: run `npm run test:ci` and `npm run build` inside `wongsakorn127-byjaimesjames/` locally, and confirm they pass.
- **Never commit without explicit per-commit confirmation from the user.** Show the diff/summary, wait for the user to say to proceed, then commit.
- One branch per ticket: `feature/WSK127-XXX-slug`. No direct commits to `main`. Open a PR, wait for CI (`ci.yml`) to go green, before it's mergeable.
- Commit messages: Conventional Commits, referencing the ticket id, e.g. `feat(WSK127-010): add wheel color picker`.

## 3. Docs/spec folder — must stay aligned with kanban

- `wongsakorn127-byjaimesjames/docs/tickets/<WSK127-XXX>-slug.md` per ticket: AC, design notes/decisions, status, link back to the issue.
- `wongsakorn127-byjaimesjames/docs/status-board.md`: single mirror of the kanban board (Todo / In Progress / Done). Update this file in the same commit whenever a ticket's status changes on the board — the two must never drift.

## 4. UI structural pattern

- Every page must compose through one shared shell providing three fixed regions: **Wongsakorn brand/title spot, navigation, profile menu**. Do not let a feature page build its own header/nav.
- Current state (gap, not yet built): `core/layout/head` only has login/profile-menu; `core/layout/navigator` only has the bottom-sheet game grid. There is no title/brand spot yet — building the shared shell component is itself a ticket, not an ad-hoc change.
- Document the shell's layout contract (region positions, responsive behavior) in `wongsakorn127-byjaimesjames/docs/` before implementing it.

## 5. Language

- Chat conversation with the user stays in whatever language they use (Thai is fine).
- Everything produced as an artifact must be English only: GitHub issues/tickets, commit messages, branch names, code, comments, UI copy/strings, and docs under `docs/`.

## Notes

- `gh` active account on this machine is `JaimesJames` (admin on this repo). The `project`
  scope needed for kanban board access has repeatedly reverted on its own — see the
  best-effort note in Rule 1.
- Production releases (`release-production.yml`) deploy Firestore rules using the
  `FIREBASE_TOKEN` secret (fixed in WSK127-004; Workload Identity Federation was not
  reliably supported by `firebase-tools deploy` and broke 3 releases in a row).
- Fixed in WSK127-005: Dependabot's `angular` group now includes `@angular-devkit/*`
  alongside `@angular/*` so they bump together instead of conflicting.
