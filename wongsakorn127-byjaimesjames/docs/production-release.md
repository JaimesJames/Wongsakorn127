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
   `main`, reruns the full quality gate, waits for production approval, deploys
   tested Firestore rules, deploys the prebuilt artifact to Vercel, and smoke-tests
   the public routes.

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
- Require at least one approval when another maintainer is available.
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
- Add environment variable `PRODUCTION_URL` with the public HTTPS production
  alias, for example `https://example.vercel.app`. Do not use a generated
  deployment URL because Vercel Deployment Protection can require SSO there.
- Add environment variables `FIREBASE_SERVICE_ACCOUNT` and
  `FIREBASE_WORKLOAD_IDENTITY_PROVIDER`.

### Configure keyless Firebase deployment

Use Google Cloud Workload Identity Federation so GitHub receives short-lived
credentials. Do not generate or store a service-account JSON key.

1. Open the Google Cloud project `wongsakorn127-byjaimesjames`.
2. Create a service account named `github-firestore-rules-deployer`.
3. Grant it **Firebase Rules Admin** and **Firebase Viewer** roles.
4. In **IAM & Admin > Workload Identity Federation**, create a pool named
   `github-actions` and an OIDC provider named `wongsakorn127`.
5. Use issuer `https://token.actions.githubusercontent.com`.
6. Map `google.subject` to `assertion.sub` and `attribute.repository` to
   `assertion.repository`.
7. Restrict the provider with the condition
   `assertion.repository == 'JaimesJames/Wongsakorn127'`.
8. Grant the repository principal access to impersonate the service account with
   the **Workload Identity User** role.
9. Copy the full provider resource name into the GitHub production environment
   variable `FIREBASE_WORKLOAD_IDENTITY_PROVIDER`. It has the form
   `projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/POOL/providers/PROVIDER`.
10. Put the service-account email into `FIREBASE_SERVICE_ACCOUNT`.

The production workflow requests `id-token: write` only for the deployment job.
Pull-request jobs cannot access the production environment or impersonate this
service account. Firestore rules deploy only after Emulator tests and all other
quality checks pass.

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
production tags until the GitHub environment, secrets, Firebase OIDC variables,
pinned CLI versions, and Vercel Git setting have all been configured.

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
