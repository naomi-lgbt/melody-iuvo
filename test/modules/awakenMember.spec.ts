import { assert } from "chai";

import { awakenMember } from "../../src/modules/awakenMember";

suite("awaken member module", () => {
  test("is defined", () => {
    assert.isDefined(awakenMember);
  });
});
