import { assert } from "chai";

import { loadDiscordCache } from "../../src/utils/loadDiscordCache";

suite("load discord cache util", () => {
  test("is defined", () => {
    assert.isDefined(loadDiscordCache);
  });
});
