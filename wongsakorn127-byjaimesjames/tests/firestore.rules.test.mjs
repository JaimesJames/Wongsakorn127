import { readFileSync } from "node:fs";
import { after, before, beforeEach, describe, test } from "node:test";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";

const PROJECT_ID = "demo-wongsakorn127";
const OWNER_ID = "alice";
const OTHER_ID = "bob";
const INITIALIZER_SET =
  "initializer/game-nosy-game/question-set/default-set";
const INITIALIZER_QUESTION = `${INITIALIZER_SET}/questions/default-question`;
const OWNER_ROOT = `users/${OWNER_ID}`;
const OWNER_SET = `${OWNER_ROOT}/games/game-nosy-game/question-set/custom-set`;
const OWNER_QUESTION = `${OWNER_SET}/questions/custom-question`;

let testEnvironment;

before(async () => {
  testEnvironment = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      host: "127.0.0.1",
      port: 8080,
      rules: readFileSync(
        new URL("../firestore.rules", import.meta.url),
        "utf8",
      ),
    },
  });
});

beforeEach(async () => {
  await testEnvironment.clearFirestore();
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const database = context.firestore();
    await setDoc(doc(database, INITIALIZER_SET), { name: "Default" });
    await setDoc(doc(database, INITIALIZER_QUESTION), { text: "Question" });
    await setDoc(doc(database, OWNER_ROOT), { email: "alice@example.com" });
    await setDoc(doc(database, OWNER_SET), { name: "Custom" });
    await setDoc(doc(database, OWNER_QUESTION), { text: "Private" });
  });
});

after(async () => {
  await testEnvironment.cleanup();
});

describe("public initializer data", () => {
  test("allows guests to read sets and questions", async () => {
    const database = testEnvironment.unauthenticatedContext().firestore();

    await assertSucceeds(getDoc(doc(database, INITIALIZER_SET)));
    await assertSucceeds(getDoc(doc(database, INITIALIZER_QUESTION)));
    await assertSucceeds(
      getDocs(collection(database, "initializer/game-nosy-game/question-set")),
    );
  });

  test("rejects initializer writes from guests and signed-in users", async () => {
    const guestDatabase = testEnvironment
      .unauthenticatedContext()
      .firestore();
    const userDatabase = testEnvironment
      .authenticatedContext(OWNER_ID)
      .firestore();

    await assertFails(
      setDoc(doc(guestDatabase, INITIALIZER_SET), { name: "Changed" }),
    );
    await assertFails(
      setDoc(doc(userDatabase, INITIALIZER_QUESTION), { text: "Changed" }),
    );
  });
});

describe("user-owned data", () => {
  test("rejects all guest access to user data", async () => {
    const database = testEnvironment.unauthenticatedContext().firestore();

    await assertFails(getDoc(doc(database, OWNER_ROOT)));
    await assertFails(getDoc(doc(database, OWNER_SET)));
    await assertFails(
      setDoc(doc(database, OWNER_QUESTION), { text: "Guest write" }),
    );
  });

  test("allows owners to read and write their root document", async () => {
    const database = testEnvironment
      .authenticatedContext(OWNER_ID)
      .firestore();

    await assertSucceeds(getDoc(doc(database, OWNER_ROOT)));
    await assertSucceeds(
      setDoc(doc(database, OWNER_ROOT), { displayName: "Alice" }),
    );
  });

  test("prevents owners from deleting their root document", async () => {
    const database = testEnvironment
      .authenticatedContext(OWNER_ID)
      .firestore();

    await assertFails(deleteDoc(doc(database, OWNER_ROOT)));
  });

  test("allows owners to manage their question sets and questions", async () => {
    const database = testEnvironment
      .authenticatedContext(OWNER_ID)
      .firestore();

    await assertSucceeds(getDoc(doc(database, OWNER_SET)));
    await assertSucceeds(
      getDocs(
        collection(
          database,
          `${OWNER_ROOT}/games/game-nosy-game/question-set`,
        ),
      ),
    );
    await assertSucceeds(
      setDoc(doc(database, OWNER_QUESTION), { text: "Updated" }),
    );
    await assertSucceeds(deleteDoc(doc(database, OWNER_QUESTION)));
    await assertSucceeds(deleteDoc(doc(database, OWNER_SET)));
  });

  test("rejects cross-user reads and writes", async () => {
    const database = testEnvironment
      .authenticatedContext(OTHER_ID)
      .firestore();

    await assertFails(getDoc(doc(database, OWNER_ROOT)));
    await assertFails(getDoc(doc(database, OWNER_SET)));
    await assertFails(
      setDoc(doc(database, OWNER_QUESTION), { text: "Stolen" }),
    );
  });
});

describe("default deny", () => {
  test("rejects access to paths that are not explicitly matched", async () => {
    const guestDatabase = testEnvironment
      .unauthenticatedContext()
      .firestore();
    const userDatabase = testEnvironment
      .authenticatedContext(OWNER_ID)
      .firestore();

    await assertFails(getDoc(doc(guestDatabase, "private/config")));
    await assertFails(setDoc(doc(userDatabase, "private/config"), { open: true }));
  });
});
