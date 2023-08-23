import { users } from "@prisma/client";

import { CurrencyValues } from "../config/Currency";

/**
 * Calculates the total of a currency object.
 *
 * @param {users["currency"]} currency The currency object from the database.
 * @returns {number} The total amount of currency the user has.
 */
export const sumCurrency = (currency: users["currency"]) => {
  const entries = Object.entries(currency) as [
    keyof users["currency"],
    number
  ][];
  const filtered = entries.filter((entry) => entry[1] > 0);
  const total = filtered.reduce(
    (sum, entry) => sum + CurrencyValues[entry[0]] * entry[1],
    0
  );
  return total;
};
