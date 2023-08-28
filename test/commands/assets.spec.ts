import { assert } from "chai";

import { assets } from "../../src/commands/assets";

suite("This is an example test", () => {
  test("It uses the assert API", () => {
    assert.isDefined(assets);
  });
});
