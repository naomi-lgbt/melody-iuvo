import { assert } from "chai";

import { loadCommands } from "../../src/utils/loadCommands";

suite("This is an example test", () => {
  test("It uses the assert API", () => {
    assert.isDefined(loadCommands);
  });
});
