import { assert } from "chai";

import { logHandler } from "../../src/utils/logHandler";

suite("This is an example test", () => {
  test("It uses the assert API", () => {
    assert.isDefined(logHandler);
  });

  // no idea what i'll test here lmao
});
