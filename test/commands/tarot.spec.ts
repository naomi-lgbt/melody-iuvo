import { assert } from "chai";

import { tarot } from "../../src/commands/tarot";

suite("tarot command", () => {
  test("is defined", () => {
    assert.isDefined(tarot);
  });
});
