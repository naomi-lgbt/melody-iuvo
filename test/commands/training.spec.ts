import { assert } from "chai";

import { training } from "../../src/commands/training";

suite("training command", () => {
  test("is defined", () => {
    assert.isDefined(training);
  });
});
