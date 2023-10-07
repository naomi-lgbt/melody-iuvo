import { assert } from "chai";

import { queue } from "../../src/commands/queue";

suite("queue command", () => {
  test("is defined", () => {
    assert.isDefined(queue);
  });
});
