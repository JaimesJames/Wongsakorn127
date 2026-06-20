# Production release process

Production deployment is intentionally separate from pull-request validation. Merging
to `main` does not authorize a production deployment. Only a valid production tag
can start the Vercel release workflow.

## Release flow

1. Open a pull request into `main`.
2. Wait for `CI / Secret scan`, `CI / Unit tests and production build`, and CodeQL.
3. Obtain review approval and merge the pull request.
4. Create an annotated tag on the chosen `main` commit, such as `PRD/v1.0.1`.
5. Push the tag. GitHub validates the tag, verifies that its commit belongs to
   `main`, reruns the full quality gate, waits for production approval, and deploys
   the prebuilt artifact to Vercel.

Example release commands:

```bash
git switch main
git pull --ff-only origin main
git tag -a PRD/v1.0.1 -m "Production v1.0.1"
git push origin PRD/v1.0.1
```

The accepted tag format is exactly `PRD/vMAJOR.MINOR.PATCH`. Tags such as
`v1.0.1`, `PRD/1.0.1`, or `PRD/v1.0.1-beta` are rejected.

## One-time GitHub settings

### Protect `main`

In **Settings > Rules > Rulesets**, create a branch ruleset for `main`:

- Require a pull request before merging.
- Require at least one approval.
- Dismiss stale approvals when new commits are pushed.
- Require status checks to pass.
- Add `Secret scan`, `Unit tests and production build`, and CodeQL as required checks
  after each has run at least once.
- Block force pushes and branch deletion.

### Create the production environment

In **Settings > Environments**, create `production`:

- Add a required reviewer when the repository plan supports it.
- Restrict deployment branches and tags to `PRD/v*`.
- Add environment secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and
`VERCEL_PROJECT_ID`.

The Vercel CLI version is pinned in `release-production.yml`. Update that exact
version deliberately through a pull request after checking `npm view vercel
version`; never replace it with `latest` in the deployment workflow.

The Vercel token is created in Vercel account settings. The organization and
project IDs are available in `.vercel/project.json` after running `vercel link`
locally; do not commit that directory or the token.

The committed Firebase web API key is a public client identifier and has an exact
match allowlist entry in `.gitleaks.toml`. Never broaden that entry to ignore the
whole environment file. Firestore rules and Firebase API-key restrictions remain
the actual authorization boundary.

## One-time Vercel setting

The Vercel Git integration can otherwise deploy directly when `main` changes. In
the Vercel project **Settings > Git**, disable automatic Git deployments. If the
project uses an Ignored Build Step, configure it to cancel every Git-triggered
build. The GitHub Actions workflow deploys with the Vercel CLI and remains the only
production path.

Keep the project root set to `wongsakorn127-byjaimesjames` in Vercel. Do not create
production tags until the GitHub environment, secrets, pinned CLI version, and
Vercel Git setting have all been configured.

## Rollback

Choose a previously released commit and create a new, higher production version
tag on it. Do not move or reuse an existing tag. This preserves an auditable release
history while restoring known code.

## Dependency security policy

CI blocks high and critical vulnerabilities in production dependencies. The full
development audit can temporarily contain advisories inherited from the current
Angular build toolchain when no compatible upstream fix exists. Dependabot tracks
those packages weekly. Do not use `npm audit fix --force` when it proposes an
Angular downgrade; update through Angular migrations and review the resulting pull
request instead.
