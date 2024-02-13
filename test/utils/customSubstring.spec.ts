import { assert } from "chai";

import { customSubstring } from "../../src/utils/customSubstring";

suite("custom substring", () => {
  test("should not trim a string under length", () => {
    assert.equal("Naomi", customSubstring("Naomi", 10));
  });

  test("should properly trim a long string", () => {
    assert.equal("Naomi...", customSubstring("Naomi is pog", 8));
  });
});
