import { assert } from "chai";

import { sleep } from "../../src/utils/sleep";

suite("sleep", () => {
  test("resolves in given time", async () => {
    const start = Date.now();
    await sleep(100);
    const end = Date.now();
    assert.isAtLeast(end - start, 90, "sleep did not resolve in given time");
    assert.isAtMost(end - start, 110, "sleep did not resolve in given time");
  });
});
