import { assert } from "chai";

import { Snippets } from "../../src/config/Snippets";

suite("Snippets config", () => {
  for (const snippet of Snippets) {
    test(`${snippet.name} should be formatted correctly`, () => {
      assert.strictEqual(
        snippet.name,
        snippet.name.toLowerCase(),
        "Snippet is not lowercase."
      );
      assert.notMatch(snippet.name, /\s+/, "Snippet name contains spaces.");
      assert.isBelow(
        snippet.response.length,
        2000,
        "Snippet response is too long"
      );
    });
  }
});
