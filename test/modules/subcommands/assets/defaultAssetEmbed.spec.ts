import { assert } from "chai";

import { defaultAssetEmbed } from "../../../../src/modules/subcommands/assets/defaultAssetEmbed";

suite("defaultAssetEmbed", () => {
  test("should have the correct information", () => {
    assert.strictEqual(defaultAssetEmbed.toJSON().title, "Oh dear!");
    assert.strictEqual(
      defaultAssetEmbed.toJSON().description,
      "I have failed to locate that asset. Please forgive me."
    );
    assert.strictEqual(defaultAssetEmbed.toJSON().color, 0xff0000);
  });
});
