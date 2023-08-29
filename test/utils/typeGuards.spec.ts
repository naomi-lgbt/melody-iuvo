import { assert } from "chai";

import {
  isGuildButtonCommand,
  isGuildCommandCommand,
  isAssetTarget,
  isGuildMessage,
} from "../../src/utils/typeGuards";

suite("This is an example test", () => {
  test("It uses the assert API", () => {
    assert.isDefined(isGuildButtonCommand);
    assert.isDefined(isGuildCommandCommand);
    assert.isDefined(isAssetTarget);
    assert.isDefined(isGuildMessage);
  });
});
