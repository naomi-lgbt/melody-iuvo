import { assert } from "chai";

import { Html } from "../../src/config/Html";

suite("This is an example test", () => {
  test("It uses the assert API", () => {
    assert.isDefined(Html);
  });

  // not sure what I'll test in this one.
});
