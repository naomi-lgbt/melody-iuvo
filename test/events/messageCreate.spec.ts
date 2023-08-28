import { assert } from "chai";

import { messageCreate } from "../../src/events/messageCreate";

suite("This is an example test", () => {
  test("It uses the assert API", () => {
    assert.isDefined(messageCreate);
  });
});
