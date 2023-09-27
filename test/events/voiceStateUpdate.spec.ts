import { assert } from "chai";

import { voiceStateUpdate } from "../../src/events/voiceStateUpdate";

suite("voiceStateUpdate event", () => {
  test("is defined", () => {
    assert.isDefined(voiceStateUpdate);
  });
});
