import { assert } from "chai";

import { getDatabaseRecord } from "../../src/utils/getDatabaseRecord";
import { Database } from "../__mocks__/Database.mock";

const db = new Database();

suite("getDatabaseRecord", () => {
  test("should return a user record", async () => {
    const result = await getDatabaseRecord({ db } as never, "naomi");
    assert.equal(result.userId, "naomi");
    assert.deepEqual(result.currency, {
      copper: 0,
      silver: 0,
      gold: 0,
      platinum: 0,
      amethyst: 0,
    });
    assert.deepEqual(result.plurals, []);
    assert.equal(result.front, "");
  });
});
