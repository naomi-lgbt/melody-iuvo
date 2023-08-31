import { assert } from "chai";

import {
  CurrencyName,
  CurrencyValues,
  CurrencyDailyEvents,
  CurrencyEmotes,
  CurrencyItems,
  CurrencySlots,
  CurrencySlotReel,
  CurrencyWords,
} from "../../src/config/Currency";

const emoteRegex = /^<(?:a)?:\w+:\d{18,19}>$/;

suite("Currency: CurrencyName", () => {
  test("is a string", () => {
    assert.isString(CurrencyName);
  });
});

suite("Currency: CurrencyValues", () => {
  test("has all keys", () => {
    assert.isDefined(CurrencyValues.copper);
    assert.isDefined(CurrencyValues.silver);
    assert.isDefined(CurrencyValues.gold);
    assert.isDefined(CurrencyValues.platinum);
    assert.isDefined(CurrencyValues.amethyst);
  });

  test("has properly scaled values", () => {
    assert.isAbove(CurrencyValues.copper, 0);
    assert.isAbove(CurrencyValues.silver, CurrencyValues.copper);
    assert.isAbove(CurrencyValues.gold, CurrencyValues.silver);
    assert.isAbove(CurrencyValues.platinum, CurrencyValues.gold);
    assert.isAbove(CurrencyValues.amethyst, CurrencyValues.platinum);
  });
});

suite("Currency: CurrencyEmotes", () => {
  test("has all keys", () => {
    assert.isDefined(CurrencyEmotes.copper);
    assert.isDefined(CurrencyEmotes.silver);
    assert.isDefined(CurrencyEmotes.gold);
    assert.isDefined(CurrencyEmotes.platinum);
    assert.isDefined(CurrencyEmotes.amethyst);
  });

  test("are all custom emotes", () => {
    assert.match(CurrencyEmotes.copper, emoteRegex);
    assert.match(CurrencyEmotes.silver, emoteRegex);
    assert.match(CurrencyEmotes.gold, emoteRegex);
    assert.match(CurrencyEmotes.platinum, emoteRegex);
    assert.match(CurrencyEmotes.amethyst, emoteRegex);
  });
});

suite("Currency: CurrencyItems", () => {
  test("are all unique", () => {
    const names = CurrencyItems.map((i) => i.name);
    const uniqueNames = new Set(names);
    assert.equal(names.length, uniqueNames.size);
    const ids = CurrencyItems.map((i) => i.internalId);
    const uniqueIds = new Set(ids);
    assert.equal(ids.length, uniqueIds.size);
  });

  test("meet length requirements", () => {
    const names = CurrencyItems.map((i) => i.name);
    for (const name of names) {
      assert.isAtMost(name.length, 100, `Name ${name} is too long.`);
    }
    const ids = CurrencyItems.map((i) => i.internalId);
    for (const id of ids) {
      assert.isAtMost(id.length, 100, `ID ${id} is too long.`);
    }
  });
});
suite("Currency: CurrencySlots", () => {
  test("are unique", () => {
    const uniqueSlots = new Set(CurrencySlots);
    assert.equal(CurrencySlots.length, uniqueSlots.size);
  });
  test("are all custom emotes", () => {
    for (const slot of CurrencySlots) {
      assert.match(slot, emoteRegex, `Slot ${slot} is not an emote.`);
    }
  });
});
suite("Currency: CurrencySlotReel", () => {
  test("is a custom emote", () => {
    assert.match(CurrencySlotReel, emoteRegex, `Slot reel is not an emote.`);
  });
});
suite("Currency: CurrencyWords", () => {
  test("are unique", () => {
    const uniqueWords = new Set(CurrencyWords);
    assert.equal(CurrencyWords.length, uniqueWords.size);
  });
});

suite("Currency: CurrencyDailyEvents", () => {
  test("are unique", () => {
    const titles = CurrencyDailyEvents.map((e) => e.title);
    const uniqueTitles = new Set(titles);
    assert.equal(titles.length, uniqueTitles.size);
  });

  test("have valid min/max values", () => {
    for (const event of CurrencyDailyEvents) {
      assert.isAtMost(event.min, event.max);
    }
  });
});

// test that slots are unique, words are unique
// test that slots and emotes and slotreel match emote regex
// test items are unique, names are only 100 characters, ids are only 100 characters
