import { assert } from "chai";

import { getSpotifySong } from "../../src/modules/getSpotifySong";

suite("get spotify song module", () => {
  test("is defined", () => {
    assert.isDefined(getSpotifySong);
  });
});
