import { assert } from "chai";

import { getRandomValue } from "../../src/utils/getRandomValue";

suite("This is an example test", () => {
  test("It uses the assert API", () => {
    assert.isDefined(getRandomValue);
  });
});
