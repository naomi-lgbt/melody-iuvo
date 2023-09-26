import { assert } from "chai";

import { yokai } from "../../src/commands/yokai";

suite("yokai command", () => {
  test("is defined", () => {
    assert.isDefined(yokai);
  });
});
