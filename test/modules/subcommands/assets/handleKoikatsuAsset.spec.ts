import { assert } from "chai";

import { handleKoikatsuAsset } from "../../../../src/modules/subcommands/assets/handleKoikatsuAsset";

suite("handleAdventureAsset", () => {
  test("should display a koikatsu", async () => {
    const embed = await handleKoikatsuAsset({} as never, "naomi");
    assert.strictEqual(
      embed?.toJSON().image?.url,
      "https://cdn.naomi.lgbt/naomi/koikatsu/test"
    );
    assert.strictEqual(embed?.toJSON().title, "Test Asset");
    assert.strictEqual(embed?.toJSON().description, "Test Description");
  });
});
