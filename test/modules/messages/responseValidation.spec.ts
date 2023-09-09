import { assert } from "chai";

import {
  isGoodMorning,
  isGoodNight,
} from "../../../src/modules/messages/responseValidation";

suite("isGoodMorning", () => {
  test("should match 'good morning'", () => {
    assert.isTrue(isGoodMorning("good morning"));
  });
  test("should match 'good day'", () => {
    assert.isTrue(isGoodMorning("good day"));
  });
  test("should match 'g'morning'", () => {
    assert.isTrue(isGoodMorning("g'morning"));
  });
  test("should match 'g'day'", () => {
    assert.isTrue(isGoodMorning("g'day"));
  });
  test("should not match 'naomi'", () => {
    assert.isFalse(isGoodMorning("naomi"));
  });
});

suite("isGoodNight", () => {
  test("should match 'good night'", () => {
    assert.isTrue(isGoodNight("good night"));
  });
  test("should match 'g'night'", () => {
    assert.isTrue(isGoodNight("g'night"));
  });
  test("should match 'night night'", () => {
    assert.isTrue(isGoodNight("night night"));
  });
  test("should match 'nini'", () => {
    assert.isTrue(isGoodNight("nini"));
  });
  test("should not match 'naomi'", () => {
    assert.isFalse(isGoodNight("naomi"));
  });
});
