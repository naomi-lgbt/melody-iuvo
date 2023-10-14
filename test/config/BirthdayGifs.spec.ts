import { assert } from "chai";

import { CryingGifs, BirthdayGifs } from "../../src/config/BirthdayGifs";

suite("Birthday gifs", () => {
  test("should have unique crying gifs", () => {
    const set = new Set(CryingGifs);
    assert.strictEqual(set.size, CryingGifs.length);
  });

  test("should have unique birthday gifs", () => {
    const set = new Set(BirthdayGifs);
    assert.strictEqual(set.size, BirthdayGifs.length);
  });

  test("should all be gif urls", () => {
    const combined = [...CryingGifs, ...BirthdayGifs];
    for (const gif of combined) {
      assert.match(gif, /\.gif$/, `${gif} is not a GIF URL`);
    }
  });
});
