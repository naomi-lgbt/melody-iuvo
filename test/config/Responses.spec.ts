import { assert } from "chai";

import { Responses } from "../../src/config/Responses";

const ids = ["465650873650118659", "cutie", "default"];

suite("Responses", () => {
  const keys = Object.keys(Responses);
  test("should have a response for every expected ID", () => {
    for (const key of keys) {
      assert.lengthOf(
        Object.keys(Responses[key]),
        ids.length,
        `${key} does not have the correct number of ids`
      );
      for (const id of ids) {
        assert.property(
          Responses[key],
          id,
          `The ${key} response is missing ${id}`
        );
      }
    }
  });

  test("should have at least 3 responses", () => {
    for (const key of keys) {
      // this one doesn't need to have responses, it's just for copy-paste purposes
      if (key === "_template") {
        continue;
      }
      for (const id of ids) {
        assert.isArray(Responses[key][id], `${key}-${id} is not an array.`);
        assert.isAtLeast(
          Responses[key][id].filter(Boolean).length,
          3,
          `${key}-${id} does not have 3 keys.`
        );
      }
    }
  });
});
