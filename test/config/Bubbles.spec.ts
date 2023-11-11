import { assert } from "chai";

import { Bubbles } from "../../src/config/Bubbles";

suite("bubbles config", () => {
  test("should all be two characters", () => {
    for (const bubble of Bubbles) {
      assert.isAtMost(
        bubble.length,
        2,
        `${bubble} has a length of ${bubble.length}`
      );
    }
  });
});
