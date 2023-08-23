import rand from "random";

/**
 * Module to select a random value from the provided array.
 *
 * @template T
 * @param {Array<T>} array The array of items to choose from.
 * @returns {T} A random item from the array.
 */
export const getRandomValue = <T>(array: T[]): T => {
  const random = rand.uniformInt(0, array.length - 1);
  return array[random()];
};
