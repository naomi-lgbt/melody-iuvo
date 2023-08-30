import { assert } from "chai";

import { getRandomValue } from "../../src/utils/getRandomValue";

suite("getRandomValue", () => {
  test("should generate uniform distribution", () => {
    const counts: { [key: number]: number } = {};
    for (let i = 0; i < 10000; i++) {
      const random = getRandomValue([1, 2, 3, 4, 5]);
      counts[random] = counts[random] ? counts[random] + 1 : 1;
    }
    assert.approximately(counts[1], 2000, 150);
    assert.approximately(counts[2], 2000, 150);
    assert.approximately(counts[3], 2000, 150);
    assert.approximately(counts[4], 2000, 150);
    assert.approximately(counts[5], 2000, 150);
  });
});
