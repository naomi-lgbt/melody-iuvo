import { assert } from "chai";

import { reloadJobs } from "../../src/commands/reload-jobs";

suite("reloadJobs command", () => {
  test("is defined", () => {
    assert.isDefined(reloadJobs);
  });
});
