import { assert } from "chai";

import { loadGeneralChannel } from "../../src/utils/loadGeneralChannel";

suite("load general channel util", () => {
  test("is defined", () => {
    assert.isDefined(loadGeneralChannel);
  });
});
