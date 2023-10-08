import { assert } from "chai";

import { IgnoredActors } from "../../src/config/Github";

suite("ignored actors", () => {
  test("should be unique", () => {
    const set = new Set(IgnoredActors);
    assert.strictEqual(set.size, IgnoredActors.length);
  });
});
