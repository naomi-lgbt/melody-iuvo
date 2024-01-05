import { assert } from "chai";

import { reloadJobs } from "../../src/commands/reloadJobs";

suite("reloadJobs command", () => {
  test("is defined", () => {
    assert.isDefined(reloadJobs);
  });
});
