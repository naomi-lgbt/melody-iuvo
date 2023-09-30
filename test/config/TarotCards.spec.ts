import { assert } from "chai";

import { TarotCards } from "../../src/config/TarotCards";

suite("TarotCards", () => {
  test("has unique names", () => {
    const names = TarotCards.map((card) => card.name);
    assert.lengthOf(names, new Set(names).size);
  });

  test("has short enough descriptions", () => {
    for (const card of TarotCards) {
      assert.isAtMost(
        card.meaning.length,
        1024,
        `Meaning for ${card.name} is too long.`
      );
      assert.isAtMost(
        card.reversed.length,
        1024,
        `Reversed meaning for ${card.name} is too long.`
      );
    }
  });
});
