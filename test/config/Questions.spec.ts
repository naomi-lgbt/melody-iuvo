import { assert } from "chai";
import { findBestMatch } from "string-similarity";

import { Questions } from "../../src/config/Questions";

suite("Question Config", () => {
  test("should not be too similar", () => {
    for (let i = 0; i < Questions.length - 1; i++) {
      const question = Questions[i];
      const similar = findBestMatch(question, Questions.slice(i + 1));
      const similarity = similar.bestMatch.rating;
      const found = similar.bestMatch.target;
      assert.isBelow(
        similarity,
        0.8,
        `${question} (line ${i + 2}) is too similar to ${found} (line ${
          similar.bestMatchIndex + i + 3
        })`
      );
    }
  });

  test("should have at least 500 questions", () => {
    assert.isAtLeast(Questions.length, 500);
  });
});
