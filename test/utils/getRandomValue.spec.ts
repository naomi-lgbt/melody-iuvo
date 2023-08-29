import { assert } from "chai";

import { getRandomValue } from "../../src/utils/getRandomValue";

suite("getRandomValue", () => {
  test("should generate uniform distribution", () => {
    const counts: { [key: number]: number } = {};
    for (let i = 0; i < 1000; i++) {
      const random = getRandomValue([1, 2, 3, 4, 5]);
      counts[random] = counts[random] ? counts[random] + 1 : 1;
    }
    assert.approximately(counts[1], 200, 25);
    assert.approximately(counts[2], 200, 25);
    assert.approximately(counts[3], 200, 25);
    assert.approximately(counts[4], 200, 25);
    assert.approximately(counts[5], 200, 25);
  });
});
