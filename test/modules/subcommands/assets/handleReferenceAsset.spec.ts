import { assert } from "chai";

import { defaultAssetEmbed } from "../../../../src/modules/subcommands/assets/defaultAssetEmbed";
import { handleReferenceAsset } from "../../../../src/modules/subcommands/assets/handleReferenceAsset";

suite("handleReferenceAsset", () => {
  test("should display an reference", async () => {
    const embed = await handleReferenceAsset({} as never, "Feet" as never);
    assert.strictEqual(
      embed.toJSON().image?.url,
      "https://cdn.naomi.lgbt/naomi/ref/feet.png"
    );
    assert.strictEqual(embed.toJSON().title, "Feet");
    assert.strictEqual(
      embed.toJSON().description,
      "Naomi keeps her toes painted a sparkly purple, and never wears socks or shoes."
    );
  });

  test("should handle an invalid target", async () => {
    const embed = await handleReferenceAsset({} as never, "invalid" as never);
    assert.deepEqual(embed, defaultAssetEmbed);
  });
});
