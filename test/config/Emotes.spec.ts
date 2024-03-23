import { assert } from "chai";

import { ActionToEmote, EventToEmote } from "../../src/config/Emotes";

suite("Emotes", () => {
  test("has action emotes", () => {
    assert.isDefined(ActionToEmote);
  });
  test("has event emotes", () => {
    assert.isDefined(EventToEmote);
  });
});
