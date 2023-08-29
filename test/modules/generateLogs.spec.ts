import { assert } from "chai";

import { generateLogs } from "../../src/modules/generateLogs";

suite("This is an example test", () => {
  test("It uses the assert API", () => {
    assert.isDefined(generateLogs);
  });
});
