import { assert } from "chai";

import { schedule } from "../../src/commands/schedule";

suite("schedule command", () => {
  test("is defined", () => {
    assert.isDefined(schedule);
  });
});
