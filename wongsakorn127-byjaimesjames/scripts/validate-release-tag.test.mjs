import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const script = fileURLToPath(
  new URL("./validate-release-tag.mjs", import.meta.url),
);

function validate(tag) {
  return spawnSync(process.execPath, [script, tag], {
    encoding: "utf8",
    env: { ...process.env, GITHUB_REF_NAME: "" },
  });
}

test("accepts a production semantic-version tag", () => {
  const result = validate("PRD/v1.0.1");

  assert.equal(result.status, 0);
  assert.match(result.stdout, /environment=production, version=v1\.0\.1/);
});

test("accepts multi-digit semantic versions", () => {
  assert.equal(validate("PRD/v12.30.400").status, 0);
});

for (const tag of [
  "v1.0.1",
  "DEV/v1.0.1",
  "PRD/1.0.1",
  "PRD/v1.0",
  "PRD/v01.0.1",
  "PRD/v1.0.1-beta",
]) {
  test(`rejects invalid tag ${tag}`, () => {
    const result = validate(tag);

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Invalid production tag/);
  });
}
