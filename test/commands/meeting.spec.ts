import { assert } from "chai";

import { meeting } from "../../src/commands/meeting";

suite("meeting command", () => {
  test("is defined", () => {
    assert.isDefined(meeting);
  });
});
