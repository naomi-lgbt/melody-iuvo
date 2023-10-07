import { assert } from "chai";

import { game } from "../../src/commands/game";

suite("game command", () => {
  test("is defined", () => {
    assert.isDefined(game);
  });
});
