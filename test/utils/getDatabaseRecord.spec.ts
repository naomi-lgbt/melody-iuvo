import { assert } from "chai";

import { getDatabaseRecord } from "../../src/utils/getDatabaseRecord";

suite("getDatabaseRecord", () => {
  test("should be defined", () => {
    assert.isDefined(getDatabaseRecord);
  });
});
