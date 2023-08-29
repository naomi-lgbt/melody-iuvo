import { assert } from "chai";

import { AssetTargets, ReferenceData } from "../../src/config/AssetData";

suite("This is an example test", () => {
  test("It uses the assert API", () => {
    assert.isDefined(AssetTargets);
    assert.isDefined(ReferenceData);
  });
});
