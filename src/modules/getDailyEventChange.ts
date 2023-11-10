import rand from "random";

import { CurrencyDailyEvents } from "../config/Currency";

/**
 * Generates a random number within the range of the event.
 *
 * @param {CurrencyDailyEvents[0]} event The event from the config list.
 * @returns {number} The amount of currency to adjust.
 */
export const getDailyEventChange = (
  event: (typeof CurrencyDailyEvents)[0]
): number => {
  const generator = rand.uniformInt(event.min, event.max);
  return generator();
};
