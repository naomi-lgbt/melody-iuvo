import { assert } from "chai";

import { postReactionRoles } from "../../../src/modules/messages/postReactionRoles";

suite("postReactionRoles", () => {
  test("is defined", () => {
    assert.isDefined(postReactionRoles);
  });
});
