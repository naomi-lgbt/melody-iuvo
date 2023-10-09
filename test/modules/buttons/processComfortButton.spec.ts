import { assert } from "chai";

import { processComfortButton } from "../../../src/modules/buttons/processComfortButton";

suite("processComfortButton", () => {
  test("is defined", () => {
    assert.exists(processComfortButton);
  });
});
