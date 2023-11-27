import { assert } from "chai";

import { calendar } from "../../src/commands/calendar";

suite("calendar command", () => {
  test("is defined", () => {
    assert.isDefined(calendar);
  });
});
