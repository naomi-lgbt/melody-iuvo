import { assert } from "chai";

import { registerCommands } from "../../src/utils/registerCommands";

suite("This is an example test", () => {
  test("It uses the assert API", () => {
    assert.isDefined(registerCommands);
  });

  // omg do I need to mock the Routes class?
});
