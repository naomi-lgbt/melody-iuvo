import { assert } from "chai";

import { todo } from "../../src/commands/todo";

suite("todo command", () => {
  test("is defined", () => {
    assert.isDefined(todo);
  });
});
