import { asciiColours } from "./asciiColours";

const generateCount = (word: string) =>
  word.split("").reduce((acc: Record<string, number>, letter) => {
    if (!acc[letter]) {
      acc[letter] = 1;
    } else {
      acc[letter]++;
    }
    return acc;
  }, {});

const countCorrect = (guess: string, target: string, letter: string) => {
  let correct = 0;
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === target[i] && guess[i] === letter) {
      correct++;
    }
  }
  return correct;
};

/**
 * Formats the word guess into a Discord-compatible ANSI colour string.
 *
 * @param {string} guess The user's guess.
 * @param {string} target The correct word.
 * @returns {string} The formatted guess.
 */
export const formatWordGuess = (guess: string, target: string) => {
  const targetCounts = generateCount(target);
  const letters: string[] = [];
  const emotes: string[] = [];
  for (let i = 0; i < guess.length; i++) {
    const guessed = guess[i];
    /**
     * Based on the loop parameters this should never be true.
     * But typescript does not believe us :c.
     */
    if (!guessed) {
      continue;
    }
    if (guess[i] === target[i]) {
      letters.push(asciiColours(guessed, "green"));
      emotes.push("🟢");
      targetCounts[guessed]--;
      continue;
    }
    if (
      target.includes(guessed) &&
      (targetCounts[guessed] ?? 0) > 0 &&
      countCorrect(guess.slice(i), target.slice(i), guessed) <
        (targetCounts[guessed] ?? 0)
    ) {
      letters.push(asciiColours(guessed, "yellow"));
      emotes.push("🟡");
      targetCounts[guessed]--;
      continue;
    }
    letters.push(asciiColours(guessed, "white"));
    emotes.push("⚪");
  }
  return `${letters.join("")}: ${emotes.join("")}`;
};
