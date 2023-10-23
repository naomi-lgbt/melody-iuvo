import rand from "random";

/**
 * Module to select a random value from the provided array.
 *
 * @template T
 * @param {Array<T>} array The array of items to choose from.
 * @returns {T} A random item from the array.
 */
export const getRandomValue = <T>(array: T[]): T => {
  if (!array.length || !array[0]) {
    throw new Error("Should not receive empty array.");
  }
  const randomGenerator = rand.uniformInt(0, array.length - 1);
  const random = randomGenerator();
  return array[random] ?? array[0];
};
