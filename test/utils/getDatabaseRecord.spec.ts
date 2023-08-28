import { assert } from "chai";

import { getDatabaseRecord } from "../../src/utils/getDatabaseRecord";

suite("This is an example test", () => {
  test("It uses the assert API", () => {
    assert.isDefined(getDatabaseRecord);
  });
});
