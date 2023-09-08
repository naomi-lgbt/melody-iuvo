import { assert } from "chai";

import { Responses } from "../../src/config/Responses";

const ids = ["478752726612967435", "465650873650118659", "710195136700874893"];

suite("Responses", () => {
  const keys = Object.keys(Responses);
  test("should have a response for every expected ID", () => {
    for (const key of keys) {
      for (const id of ids) {
        assert.property(
          Responses[key],
          id,
          `The ${key} response is missing ${id}`
        );
      }
    }
  });
});
