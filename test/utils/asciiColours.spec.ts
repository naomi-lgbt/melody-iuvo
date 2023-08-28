import { assert } from "chai";

import { asciiColours } from "../../src/utils/asciiColours";

suite("This is an example test", () => {
  test("It uses the assert API", () => {
    assert.isDefined(asciiColours);
  });
});
