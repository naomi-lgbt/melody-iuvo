import { assert } from "chai";

import { handleAgeModal } from "../../../src/modules/modals/handleAgeModal";

suite("handleAgeModal", () => {
  test("is defined", () => {
    assert.exists(handleAgeModal);
  });
});
