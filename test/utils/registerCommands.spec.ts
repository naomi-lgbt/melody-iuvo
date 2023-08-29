import { assert } from "chai";

import { registerCommands } from "../../src/utils/registerCommands";

suite("registerCommands", () => {
  test("is defined", () => {
    assert.isDefined(registerCommands);
  });

  // omg do I need to mock the Routes class?
});
