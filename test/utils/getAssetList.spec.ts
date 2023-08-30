import { assert } from "chai";

import { getAssetList } from "../../src/utils/getAssetList";

suite("getAssetList", () => {
  test("should successfully fetch an asset list", async () => {
    const result = await getAssetList("naomi", "emotes");
    assert.isArray(result);
    assert.isObject(result[0]);
    assert.property(result[0], "name");
    assert.property(result[0], "fileName");
    assert.property(result[0], "description");
    assert.property(result[0], "alt");
  });
});
