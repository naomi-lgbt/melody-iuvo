import { assert } from "chai";

import { loadSteam } from "../../src/utils/loadSteam";

suite("mount twitch util", () => {
  test("is defined", () => {
    assert.isDefined(loadSteam);
  });
});
