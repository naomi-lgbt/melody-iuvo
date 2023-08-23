import { assert } from "chai";

import { isValidHex } from "../../src/modules/isValidHex";

suite("isValidHex util", () => {
  test("handles valid 6 character code", () => {
    assert.isTrue(isValidHex("ffffff"));
    assert.isTrue(isValidHex("ABC123"));
  });

  test("handles valid 7 character code", () => {
    assert.isTrue(isValidHex("#ffffff"));
    assert.isTrue(isValidHex("#ABC123"));
  });

  test("handles invalid 6 character code", () => {
    assert.isFalse(isValidHex("abc1234"));
    assert.isFalse(isValidHex("abc12"));
    assert.isFalse(isValidHex("aaaaaaaa"));
    assert.isFalse(isValidHex("#123xyz"));
  });
});
