import { assert } from "chai";

import { interactionCreate } from "../../src/events/interactionCreate";

suite("This is an example test", () => {
  test("It uses the assert API", () => {
    assert.isDefined(interactionCreate);
  });
});
