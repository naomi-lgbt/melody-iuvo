import { assert } from "chai";

import { Faq } from "../../src/config/Faq";

suite("Faq", () => {
  test("are unique", () => {
    const titles = Faq.map((f) => f.title);
    const uniqueTitles = new Set(titles);
    assert.equal(titles.length, uniqueTitles.size);
    const descriptions = Faq.map((f) => f.description);
    const uniqueDescriptions = new Set(descriptions);
    assert.equal(descriptions.length, uniqueDescriptions.size);
  });

  test("meet length requirements", () => {
    const titles = Faq.map((f) => f.title);
    for (const title of titles) {
      assert.isAtMost(title.length, 100);
    }
    const descriptions = Faq.map((f) => f.description);
    for (const description of descriptions) {
      assert.isAtMost(description.length, 4096);
    }
  });
});
