import { assert } from "chai";

import { announceCovenStats } from "../../src/modules/announceCovenStats";

suite("announce coven stats module", () => {
  test("is defined", () => {
    assert.isDefined(announceCovenStats);
  });
});
