import { assert } from "chai";

import { postOnboardingForm } from "../../../src/modules/messages/postOnboardingForm";

suite("postOnboardingForm", () => {
  test("is defined", () => {
    assert.isDefined(postOnboardingForm);
  });
});
