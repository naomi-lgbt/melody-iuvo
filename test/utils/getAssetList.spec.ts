import { assert } from "chai";

import { getAssetList } from "../../src/utils/getAssetList";

suite("getAssetList", () => {
  test("should be defined", () => {
    assert.isDefined(getAssetList);
  });
});
