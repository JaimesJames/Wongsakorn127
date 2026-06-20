# Firebase production readiness

This app currently uses Firebase Authentication and Cloud Firestore.

## Spark plan compatibility

The current code path should work on the Firebase Spark plan as long as quota is not exceeded:

- Authentication: email/password and Google sign-in
- Firestore: initializer question sets and user-owned question sets

The app does not currently use Phone Auth, Cloud Functions, Firebase App Hosting, or Firebase Storage APIs in code.

## Console checklist

- Confirm the Firebase project plan is Spark or Blaze intentionally.
- Enable Authentication providers: Email/Password and Google.
- Confirm Cloud Firestore database exists and is active.
- Publish Firestore rules based on `firestore.rules`.
- Check usage quotas before public launch.
- Add billing budget alerts before upgrading to Blaze.

## Firestore data paths

- `initializer/game-nosy-game/question-set/{setId}`
- `initializer/game-nosy-game/question-set/{setId}/questions/{questionId}`
- `users/{userId}`
- `users/{userId}/games/game-nosy-game/question-set/{setId}`
- `users/{userId}/games/game-nosy-game/question-set/{setId}/questions/{questionId}`

## Security model

- Anyone can read initializer question sets.
- No client can write initializer data.
- Signed-in users can read/write only their own `users/{uid}` tree.
- Users cannot delete their root user document from the client.

## Emulator rules tests

Firestore rules are tested against the local Firebase Emulator with a demo project
ID, so the suite cannot access production resources:

```bash
npm run test:rules
```

The suite requires Java 21 and covers public initializer reads, denied initializer
writes, guest isolation, owner CRUD operations, cross-user isolation, root-user
deletion, and default-deny behavior. GitHub Actions installs Java 21 and runs these
tests for every pull request and production quality gate.
