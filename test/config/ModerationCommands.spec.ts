import { assert } from "chai";

import { ModerationCommands } from "../../src/config/ModerationCommands";

suite("ModerationCommands", () => {
  test("is defined", () => {
    assert.isDefined(ModerationCommands);
  });
});
