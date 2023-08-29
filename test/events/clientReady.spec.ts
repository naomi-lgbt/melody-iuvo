import { assert } from "chai";

import { clientReady } from "../../src/events/clientReady";

suite("This is an example test", () => {
  test("It uses the assert API", () => {
    assert.isDefined(clientReady);
  });
});
