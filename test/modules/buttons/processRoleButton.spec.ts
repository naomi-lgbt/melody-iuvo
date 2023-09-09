import { assert } from "chai";

import { processRoleButton } from "../../../src/modules/buttons/processRoleButton";

suite("processRoleButton", () => {
  test("is defined", () => {
    assert.exists(processRoleButton);
  });
});
