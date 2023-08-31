import { assert } from "chai";

import { CurrencyDailyEvents } from "../../src/config/Currency";
import { getDailyEventChange } from "../../src/modules/getDailyEventChange";

suite("getDailyEventChange module", () => {
  test("should return a number within the expected range.", () => {
    for (const event of CurrencyDailyEvents) {
      const total = getDailyEventChange(event);
      assert.isAtMost(total, event.max);
      assert.isAtLeast(total, event.min);
    }
  });
});
