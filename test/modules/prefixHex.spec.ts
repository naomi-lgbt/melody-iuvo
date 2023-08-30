import { assert } from "chai";

import { prefixHex } from "../../src/modules/prefixHex";

suite("prefixHex", () => {
  test("should return the correct value for no prefix", () => {
    assert.strictEqual(prefixHex("000000"), "#000000");
  });
  test("should return the correct value for yes prefix", () => {
    assert.strictEqual(prefixHex("#000000"), "#000000");
  });
});
