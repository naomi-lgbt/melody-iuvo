import { assert } from "chai";

import { ReferenceData } from "../../src/config/AssetData";

suite("AssetData: Reference Data", () => {
  test("are unique", () => {
    const fileNames = ReferenceData.map((d) => d.fileName);
    const uniqueFileNames = new Set(fileNames);
    assert.equal(fileNames.length, uniqueFileNames.size);
  });
});
