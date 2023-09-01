import { assert } from "chai";

import { handlePicrewAsset } from "../../../../src/modules/subcommands/assets/handlePicrewAsset";

suite("handlePicrewAsset", () => {
  test("should display an picrew", async () => {
    const embed = await handlePicrewAsset({} as never, "naomi");
    assert.strictEqual(
      embed?.toJSON().image?.url,
      "https://cdn.naomi.lgbt/naomi/picrew/test"
    );
    assert.strictEqual(embed?.toJSON().title, "Picrew!");
  });
});
