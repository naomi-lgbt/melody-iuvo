import { assert } from "chai";

import { CurrencyEmotes } from "../../src/config/Currency";
import { parseCurrencyString } from "../../src/modules/parseCurrencyString";

const currencyOne = {
  copper: 12,
  silver: 44,
  gold: 0,
  platinum: 4,
  amethyst: 5
};

const currencyTwo = {
  copper: 1,
  silver: 1,
  gold: 1,
  platinum: 1,
  amethyst: 1
};

suite("parseCurrencyString module", () => {
  test("should return the correct string", () => {
    assert.deepEqual(
      parseCurrencyString(currencyOne),
      `${CurrencyEmotes.copper}: 12\n${CurrencyEmotes.silver}: 44\n${CurrencyEmotes.gold}: 0\n${CurrencyEmotes.platinum}: 4\n${CurrencyEmotes.amethyst}: 5`
    );
    assert.deepEqual(
      parseCurrencyString(currencyTwo),
      `${CurrencyEmotes.copper}: 1\n${CurrencyEmotes.silver}: 1\n${CurrencyEmotes.gold}: 1\n${CurrencyEmotes.platinum}: 1\n${CurrencyEmotes.amethyst}: 1`
    );
  });
});
