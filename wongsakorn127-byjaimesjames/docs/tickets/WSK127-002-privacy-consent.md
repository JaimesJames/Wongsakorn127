# WSK127-002 [UxUi/FE] Inform privacy policy before register

- Kanban: https://github.com/JaimesJames/Wongsakorn127/issues/2
- Status: In Progress
- Branch: feature/WSK127-002-privacy-consent

## Acceptance Criteria
- [x] Register form shows one checkbox, unchecked by default: "I agree to the Privacy Policy and Terms & Conditions", with inline clickable links.
- [x] The "register" submit button stays disabled while the checkbox is unchecked.
- [x] In register mode (`isLogin === false`), the "Continue with Google" button stays disabled while the checkbox is unchecked.
- [x] In login mode (`isLogin === true`), the Google button behaves as before (not gated).
- [x] Checking the checkbox enables the register submit button, and (in register mode) the Google button.
- [x] Clicking the Privacy Policy / Terms & Conditions links opens a new route (`/legal`) showing a placeholder page clearly marked "Placeholder - final copy TBD".
- [x] The auth page footer (visible in both login and register mode) shows links to Privacy Policy and Terms & Conditions.
- [x] Switching between Login and Register mode resets the checkbox to unchecked.
- [x] Unit tests cover: submit disabled when unchecked; submit enabled when checked; Google button gated only in register mode; checkbox resets on mode toggle.

## Design notes / decisions
- Scope combines Privacy Policy and Terms & Conditions behind a single checkbox and a single placeholder route (`/legal`) — no separate pages, per product decision.
- Google sign-in is gated only while in register mode, since the same button also serves as the login path for existing accounts.

## Test plan
- `npm run test:ci` — unit tests for `AuthComponent` and `LegalComponent`.
- Manual verification in browser: register mode checkbox/button gating, mode-toggle reset, `/legal` placeholder route.
