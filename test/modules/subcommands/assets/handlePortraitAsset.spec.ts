import { assert } from "chai";

import { defaultAssetEmbed } from "../../../../src/modules/subcommands/assets/defaultAssetEmbed";
import { handlePortraitAsset } from "../../../../src/modules/subcommands/assets/handlePortraitAsset";

suite("handlePortraitAsset", () => {
  test("should display an portrait", async () => {
    const embed = await handlePortraitAsset({} as never, "naomi");
    assert.strictEqual(
      embed?.toJSON().image?.url,
      "https://cdn.naomi.lgbt/naomi/art/test"
    );
    assert.strictEqual(embed?.toJSON().title, "Test Asset");
    assert.strictEqual(embed?.toJSON().description, "Test Description");
  });

  test("should handle an invalid target", async () => {
    const embed = await handlePortraitAsset({} as never, "invalid" as never);
    assert.deepEqual(embed, defaultAssetEmbed);
  });
});
