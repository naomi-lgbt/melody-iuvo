import { assert } from "chai";

import { BirthdayGifs } from "../../src/config/BirthdayGifs";

suite("Birthday gifs", () => {
  test("should have unique birthday gifs", () => {
    const set = new Set(BirthdayGifs);
    assert.strictEqual(set.size, BirthdayGifs.length);
  });

  test("should all be gif urls", () => {
    const combined = [...BirthdayGifs];
    for (const gif of combined) {
      assert.match(gif, /\.gif$/, `${gif} is not a GIF URL`);
    }
  });
});
