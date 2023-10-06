import { assert } from "chai";

import { mountTwitch } from "../../src/utils/mountTwitch";

suite("mount twitch util", () => {
  test("is defined", () => {
    assert.isDefined(mountTwitch);
  });
});
