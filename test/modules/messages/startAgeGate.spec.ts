import { assert } from "chai";

import { startAgeGate } from "../../../src/modules/messages/startAgeGate";

suite("startAgeGate", () => {
  test("is defined", () => {
    assert.isDefined(startAgeGate);
  });
});
