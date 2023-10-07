import { assert } from "chai";

import { GameQueue } from "../../src/config/GameQueue";

suite("Game Queue", () => {
  test("has at least 5 games", () => {
    assert.isAtLeast(GameQueue.length, 5);
  });

  test("has unique values", () => {
    const names = new Set(GameQueue.map((g) => g.name));
    const urls = new Set(GameQueue.map((g) => g.url));
    const images = new Set(GameQueue.map((g) => g.image));
    assert.strictEqual(names.size, GameQueue.length, "Name are not unique");
    assert.strictEqual(urls.size, GameQueue.length, "URLs are not unique");
    assert.strictEqual(images.size, GameQueue.length, "Images are not unique");
  });

  test("has a time for each game", () => {
    for (const game of GameQueue) {
      assert.isAbove(game.time, 0, `${game.name} has a time of 0`);
    }
  });
});
