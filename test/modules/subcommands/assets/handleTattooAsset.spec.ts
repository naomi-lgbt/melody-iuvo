import { assert } from "chai";

import { handleTattooAsset } from "../../../../src/modules/subcommands/assets/handleTattooAsset";

suite("handleTattooAsset", () => {
  test("should display an tattoo", async () => {
    const embed = await handleTattooAsset({} as never, "naomi");
    assert.strictEqual(
      embed.toJSON().image?.url,
      "https://cdn.naomi.lgbt/naomi/ref/tattoos/test"
    );
    assert.strictEqual(embed.toJSON().title, "Test Asset");
    assert.strictEqual(
      embed.toJSON().description,
      "Naomi's tattoos can be hidden or visible at her whim."
    );
  });
});
