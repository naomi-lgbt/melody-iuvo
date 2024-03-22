import { assert } from "chai";

import { processOnboardingButton } from "../../../src/modules/buttons/processOnboardingButton";

suite("processOnboardingButton", () => {
  test("is defined", () => {
    assert.exists(processOnboardingButton);
  });
});
