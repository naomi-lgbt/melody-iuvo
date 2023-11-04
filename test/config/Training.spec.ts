import { assert } from "chai";

import {
  FocusChoices,
  MagicChoices,
  PurposeChoices
} from "../../src/config/Training";

suite("Training config", () => {
  test("Focus choices should start with 'I wish to be'", () => {
    const values = Object.values(FocusChoices);
    for (const value of values) {
      assert.match(value, /^i wish to be/i);
    }
  });

  test("Magic choices should start with 'I wish to use my magic'", () => {
    const values = Object.values(MagicChoices);
    for (const value of values) {
      assert.match(value, /^i wish to use my magic/i);
    }
  });

  test("Purpose choices should start with 'I wish to spend my time'", () => {
    const values = Object.values(PurposeChoices);
    for (const value of values) {
      assert.match(value, /^i wish to spend my time/i);
    }
  });
});
