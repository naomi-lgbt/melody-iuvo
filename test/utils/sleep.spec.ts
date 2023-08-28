import { assert } from "chai";

import { sleep } from "../../src/utils/sleep";

suite("This is an example test", () => {
  test("It uses the assert API", () => {
    assert.isDefined(sleep);
  });
});
