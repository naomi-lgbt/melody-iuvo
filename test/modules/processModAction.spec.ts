import { assert } from "chai";

import { processModAction } from "../../src/modules/processModAction";

suite("assign roles module", () => {
  test("is defined", () => {
    assert.isDefined(processModAction);
  });
});
