import { assert } from "chai";

import { defaultAssetEmbed } from "../../../../src/modules/subcommands/assets/defaultAssetEmbed";
import { handleAdventureAsset } from "../../../../src/modules/subcommands/assets/handleAdventureAsset";

suite("handleAdventureAsset", () => {
  test("should display an adventure", async () => {
    const embed = await handleAdventureAsset({} as never, "naomi");
    assert.strictEqual(
      embed?.toJSON().image?.url,
      "https://cdn.naomi.lgbt/naomi/games/test"
    );
    assert.strictEqual(embed?.toJSON().title, "Test Asset");
    assert.strictEqual(embed?.toJSON().description, "Test Description");
  });

  test("should handle an invalid target", async () => {
    const embed = await handleAdventureAsset({} as never, "invalid" as never);
    assert.deepEqual(embed, defaultAssetEmbed);
  });
});
