import { assert } from "chai";

import { isOwner } from "../../src/utils/isOwner";

suite("This is an example test", () => {
  test("It uses the assert API", () => {
    assert.isDefined(isOwner);
  });
});
