import { assert } from "chai";

import { createLogFile } from "../../src/modules/createLogFile";

suite("This is an example test", () => {
  test("It uses the assert API", () => {
    assert.isDefined(createLogFile);
  });
});
