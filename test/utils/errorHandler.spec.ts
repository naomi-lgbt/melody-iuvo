import { assert } from "chai";

import { errorHandler } from "../../src/utils/errorHandler";

suite("This is an example test", () => {
  test("It uses the assert API", () => {
    assert.isDefined(errorHandler);
  });
});
