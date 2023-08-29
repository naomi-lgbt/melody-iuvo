import { assert } from "chai";

import { AssetTargets, ReferenceData } from "../../src/config/AssetData";

suite("AssetData: Reference Data", () => {
  test("are unique", () => {
    const fileNames = ReferenceData.map((d) => d.fileName);
    const uniqueFileNames = new Set(fileNames);
    assert.equal(fileNames.length, uniqueFileNames.size);
  });
});

suite("AssetData: Asset Targets", () => {
  test("are correct", () => {
    assert.deepEqual(
      AssetTargets.adventure,
      ["naomi", "becca", "rosalia"],
      "Adventures targets are incorrect."
    );
    assert.deepEqual(
      AssetTargets.emote,
      ["naomi", "becca"],
      "Emote targets are incorrect."
    );
    assert.deepEqual(
      AssetTargets.portrait,
      ["naomi", "becca", "rosalia", "beccalia"],
      "Portrait targets are incorrect."
    );
    assert.deepEqual(
      AssetTargets.koikatsu,
      ["naomi", "becca", "rosalia", "beccalia", "melody"],
      "Koikatsu targets are incorrect."
    );
  });
});
