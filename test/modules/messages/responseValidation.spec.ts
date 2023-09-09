import { assert } from "chai";

import {
  isGoodMorning,
  isGoodNight,
  isThanks,
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

suite("isThanks", () => {
  test("should match 'thanks'", () => {
    assert.isTrue(isThanks("thanks"));
  });
  test("should match 'thank you'", () => {
    assert.isTrue(isThanks("thank you"));
  });
  test("should match 'thankies'", () => {
    assert.isTrue(isThanks("thankies"));
  });
  test("should match 'ty'", () => {
    assert.isTrue(isThanks("ty"));
  });
  test("should match 'thx'", () => {
    assert.isTrue(isThanks("thx"));
  });
  test("should not match 'naomi'", () => {
    assert.isFalse(isThanks("naomi"));
  });
  test("should not match 'tyler'", () => {
    assert.isFalse(isThanks("tyler"));
  });
  test("should not match thxgiving", () => {
    assert.isFalse(isThanks("thxgiving"));
  });
  test("should not match 'no thanks'", () => {
    assert.isFalse(isThanks("no thanks"));
  });
  test("should not match 'no thank you'", () => {
    assert.isFalse(isThanks("no thank you"));
  });
  test("should not match 'no thankies'", () => {
    assert.isFalse(isThanks("no thankies"));
  });
  test("should not match 'no ty'", () => {
    assert.isFalse(isThanks("no ty"));
  });
  test("should not match 'no thx'", () => {
    assert.isFalse(isThanks("no thx"));
  });
  test("should not match 'noty'", () => {
    assert.isFalse(isThanks("noty"));
  });
  test("should not match 'nothx'", () => {
    assert.isFalse(isThanks("nothx"));
  });
});
