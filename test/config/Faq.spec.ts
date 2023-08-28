import { assert } from "chai";

import { Faq } from "../../src/config/Faq";

suite("This is an example test", () => {
  test("It uses the assert API", () => {
    assert.isDefined(Faq);
  });

  // test that title and description are unique
  // test titles are under 100 characters (embed allows 256, but option choice only allows 100)
  // test that descriptions are under 4096 characters
});
