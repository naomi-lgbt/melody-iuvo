import { assert } from "chai";

import { CacheChoices } from "../../src/config/CacheChoices";
import { ExtendedClient } from "../../src/interfaces/ExtendedClient";

suite("Cache Choices", () => {
  test("are unique", () => {
    const values = CacheChoices.map((c) => c.value);
    const uniqueValues = new Set(values);
    assert.equal(values.length, uniqueValues.size);
  });
  test("are correct", () => {
    const fakeClient = {} as ExtendedClient;
    fakeClient.cache = {
      wordGame: {},
      slots: {},
    };
    const values = CacheChoices.map((c) => c.value);
    const keys = Object.keys(fakeClient.cache);
    assert.deepEqual(values, keys);
  });
});
