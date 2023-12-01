import { assert } from "chai";

import { tasks } from "../../src/commands/tasks";

suite("tasks command", () => {
  test("is defined", () => {
    assert.isDefined(tasks);
  });
});
