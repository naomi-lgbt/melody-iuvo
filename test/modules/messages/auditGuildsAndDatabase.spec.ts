import { assert } from "chai";

import { auditGuildsAndDatabase } from "../../../src/modules/messages/auditGuildsAndDatabase";

suite("auditGuildsAndDatabase", () => {
  test("is defined", () => {
    assert.exists(auditGuildsAndDatabase);
  });
});
