import { assert } from "chai";

import {
  CurrencyName,
  CurrencyValues,
  CurrencyEmotes,
  CurrencyItems,
  CurrencySlots,
  CurrencySlotReel,
  CurrencyWords,
} from "../../src/config/Currency";

suite("This is an example test", () => {
  test("It uses the assert API", () => {
    assert.isDefined(CurrencyName);
    assert.isDefined(CurrencyValues);
    assert.isDefined(CurrencyEmotes);
    assert.isDefined(CurrencyItems);
    assert.isDefined(CurrencySlots);
    assert.isDefined(CurrencySlotReel);
    assert.isDefined(CurrencyWords);
  });

  // test that slots are unique, words are unique
  // test that slots and emotes and slotreel match emote regex
  // test items are unique, names are only 100 characters, ids are only 100 characters
});
