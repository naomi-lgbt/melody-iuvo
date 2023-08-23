import { assert } from "chai";

import { asciiColours } from "../../src/utils/asciiColours";
import { formatWordGuess } from "../../src/utils/formatWordGuess";

suite("format word guess util", () => {
  test("should format correct word guess", () => {
    assert.equal(
      formatWordGuess("testy", "testy"),
      `${asciiColours("t", "green")}${asciiColours("e", "green")}${asciiColours(
        "s",
        "green"
      )}${asciiColours("t", "green")}${asciiColours("y", "green")}: 🟢🟢🟢🟢🟢`
    );
  });

  test("should format with no correct letters", () => {
    assert.equal(
      formatWordGuess("aaaaa", "bbbbb"),
      `${asciiColours("a", "white")}${asciiColours("a", "white")}${asciiColours(
        "a",
        "white"
      )}${asciiColours("a", "white")}${asciiColours("a", "white")}: ⚪⚪⚪⚪⚪`
    );
  });

  test("should format with single correct letter", () => {
    assert.equal(
      formatWordGuess("acccc", "abbbb"),
      `${asciiColours("a", "green")}${asciiColours("c", "white")}${asciiColours(
        "c",
        "white"
      )}${asciiColours("c", "white")}${asciiColours("c", "white")}: 🟢⚪⚪⚪⚪`
    );
  });

  test("should format with correct letter in early position", () => {
    assert.equal(
      formatWordGuess("abcde", "fghai"),
      `${asciiColours("a", "yellow")}${asciiColours(
        "b",
        "white"
      )}${asciiColours("c", "white")}${asciiColours(
        "d",
        "white"
      )}${asciiColours("e", "white")}: 🟡⚪⚪⚪⚪`
    );
  });

  test("should format with correct letter in late position", () => {
    assert.equal(
      formatWordGuess("abcde", "efghi"),
      `${asciiColours("a", "white")}${asciiColours("b", "white")}${asciiColours(
        "c",
        "white"
      )}${asciiColours("d", "white")}${asciiColours("e", "yellow")}: ⚪⚪⚪⚪🟡`
    );
  });

  test("should format with two letters in incorrect position", () => {
    assert.equal(
      formatWordGuess("abcde", "efgai"),
      `${asciiColours("a", "yellow")}${asciiColours(
        "b",
        "white"
      )}${asciiColours("c", "white")}${asciiColours(
        "d",
        "white"
      )}${asciiColours("e", "yellow")}: 🟡⚪⚪⚪🟡`
    );
  });

  test("should format with correct letter in early position and correct letter in correct position", () => {
    assert.equal(
      formatWordGuess("abacd", "eaaee"),
      `${asciiColours("a", "yellow")}${asciiColours(
        "b",
        "white"
      )}${asciiColours("a", "green")}${asciiColours(
        "c",
        "white"
      )}${asciiColours("d", "white")}: 🟡⚪🟢⚪⚪`
    );
  });

  test("should format with correct letter in correct position and correct letter in late position", () => {
    assert.equal(
      formatWordGuess("abacd", "aaeee"),
      `${asciiColours("a", "green")}${asciiColours("b", "white")}${asciiColours(
        "a",
        "yellow"
      )}${asciiColours("c", "white")}${asciiColours("d", "white")}: 🟢⚪🟡⚪⚪`
    );
  });

  test("should format correctly with correct letter in early position, correct letter in correct position, correct letter in late position", () => {
    assert.equal(
      formatWordGuess("abaca", "eaaae"),
      `${asciiColours("a", "yellow")}${asciiColours(
        "b",
        "white"
      )}${asciiColours("a", "green")}${asciiColours(
        "c",
        "white"
      )}${asciiColours("a", "yellow")}: 🟡⚪🟢⚪🟡`
    );
  });

  test("should format correctly with correct letter in correct position, correct letter now incorrect because too many", () => {
    assert.equal(
      formatWordGuess("abacd", "aefgh"),
      `${asciiColours("a", "green")}${asciiColours("b", "white")}${asciiColours(
        "a",
        "white"
      )}${asciiColours("c", "white")}${asciiColours("d", "white")}: 🟢⚪⚪⚪⚪`
    );
  });

  test("should format correctly with correct letter now incorrect because too many, correct letter in correct position", () => {
    assert.equal(
      formatWordGuess("abacd", "efagh"),
      `${asciiColours("a", "white")}${asciiColours("b", "white")}${asciiColours(
        "a",
        "green"
      )}${asciiColours("c", "white")}${asciiColours("d", "white")}: ⚪⚪🟢⚪⚪`
    );
  });

  test("should format correctly with correct letter in early position, correct letter in correct position, correct letter that is now incorrect because too many", () => {
    assert.equal(
      formatWordGuess("abaca", "eaaee"),
      `${asciiColours("a", "yellow")}${asciiColours(
        "b",
        "white"
      )}${asciiColours("a", "green")}${asciiColours(
        "c",
        "white"
      )}${asciiColours("a", "white")}: 🟡⚪🟢⚪⚪`
    );
  });
});

suite("REGRESSIONS: format word guess util", () => {
  test("comparing extra to alert", () => {
    assert.equal(
      formatWordGuess("extra", "alert"),
      `${asciiColours("e", "yellow")}${asciiColours(
        "x",
        "white"
      )}${asciiColours("t", "yellow")}${asciiColours(
        "r",
        "green"
      )}${asciiColours("a", "yellow")}: 🟡⚪🟡🟢🟡`
    );
  });
});
