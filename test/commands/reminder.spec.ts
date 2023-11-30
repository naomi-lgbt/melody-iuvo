import { assert } from "chai";

import { reminder } from "../../src/commands/reminder";

suite("reminder command", () => {
  test("is defined", () => {
    assert.isDefined(reminder);
  });
});
