import { assert } from "chai";

import { assignRoles } from "../../src/modules/assignRoles";

suite("assign roles module", () => {
  test("is defined", () => {
    assert.isDefined(assignRoles);
  });
});
