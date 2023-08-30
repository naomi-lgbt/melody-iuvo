import { assert } from "chai";

import { clientReady } from "../../src/events/clientReady";

suite("clientReady event", () => {
  test("should not error", () => {
    assert.doesNotThrow(() => clientReady({} as never));
  });
});
