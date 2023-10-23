import { assert } from "chai";

import { defaultAssetEmbed } from "../../../../src/modules/subcommands/assets/defaultAssetEmbed";
import { handleEmoteAsset } from "../../../../src/modules/subcommands/assets/handleEmoteAsset";

suite("handleEmoteAsset", () => {
  test("should display an emote", async () => {
    const embed = await handleEmoteAsset({} as never, "naomi");
    assert.strictEqual(
      embed?.toJSON().image?.url,
      "https://cdn.naomi.lgbt/naomi/emotes/test"
    );
    assert.strictEqual(embed.toJSON().title, "Test Asset");
    assert.strictEqual(embed.toJSON().description, "Test Description");
  });

  test("should credit starfazers on becca emotes", async () => {
    const embed = await handleEmoteAsset({} as never, "becca");
    assert.strictEqual(
      embed.toJSON().image?.url,
      "https://cdn.naomi.lgbt/becca/emotes/test"
    );
    assert.strictEqual(embed.toJSON().title, "Test Asset");
    assert.strictEqual(embed.toJSON().description, "Test Description");
    assert.deepEqual(embed.toJSON().fields, [
      {
        name: "Art By:",
        value: "[Starfazers](https://starfazers.art)"
      }
    ]);
  });

  test("should handle an invalid target", async () => {
    const embed = await handleEmoteAsset({} as never, "invalid" as never);
    assert.deepEqual(embed, defaultAssetEmbed);
  });
});
