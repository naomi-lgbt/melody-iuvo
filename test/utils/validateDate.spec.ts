import { assert } from "chai";

import { validateDate } from "../../src/utils/validateDate";

suite("validate date util", () => {
  test("should accept a valid date string", () => {
    assert.isTrue(validateDate("Oct", 12));
  });
  test("should reject an invalid date/month combo", () => {
    assert.isFalse(validateDate("Feb", 31));
  });
  test("should reject bad months", () => {
    assert.isFalse(validateDate("Naomi", 1));
  });
});
