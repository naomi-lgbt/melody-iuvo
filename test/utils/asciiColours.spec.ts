import { assert } from "chai";

import { asciiColours } from "../../src/utils/asciiColours";

suite("asciiColours", () => {
  test("returns the correct strings", () => {
    assert.equal(asciiColours("test", "green"), "[2;36mtest[0m");
    assert.equal(asciiColours("test", "yellow"), "[2;33mtest[0m");
    assert.equal(asciiColours("test", "white"), "[2;37mtest[0m");
    assert.equal(asciiColours("test", "red"), "[2;31mtest[0m");
  });
  test("handles invalid colours", () => {
    assert.equal(asciiColours("test", "invalid" as unknown as "green"), "test");
  });
});
