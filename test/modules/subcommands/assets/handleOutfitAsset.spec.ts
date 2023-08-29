import { assert } from "chai";

import { handleOutfitAsset } from "../../../../src/modules/subcommands/assets/handleOutfitAsset";

suite("handleOutfitAsset", () => {
  test("should display an outfit", async () => {
    const embed = await handleOutfitAsset({} as never, "naomi");
    assert.strictEqual(
      embed?.toJSON().image?.url,
      "https://cdn.naomi.lgbt/naomi/outfits/test"
    );
    assert.strictEqual(embed?.toJSON().title, "Test Asset");
    assert.strictEqual(embed?.toJSON().description, "Test Description");
  });
});
