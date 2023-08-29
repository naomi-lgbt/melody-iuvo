import { assert } from "chai";

import { isOwner } from "../../src/utils/isOwner";

suite("isOwner", () => {
  test("should return true with Naomi's work ID", () => {
    assert.isTrue(isOwner("465650873650118659"));
  });
  test("should return true with Naomi's personal ID", () => {
    assert.isTrue(isOwner("710195136700874893"));
  });
  test("should return false with a random ID", () => {
    assert.isFalse(isOwner("716707753090875473"));
    assert.isFalse(isOwner("1143757929170878534"));
  });
});
