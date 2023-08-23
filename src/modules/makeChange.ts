import { users } from "@prisma/client";

import { CurrencyValues } from "../config/Currency";

/**
 * Converts a number into a currency object.
 *
 * @param {number} amount The sum of money to convert.
 * @returns {users["currency"]} The updated currency object.
 */
export const makeChange = (amount: number): users["currency"] => {
  let clonedAmount = amount;
  const values = Object.entries(CurrencyValues) as [
    keyof users["currency"],
    number
  ][];
  const sortedValues = values.sort((a, b) => b[1] - a[1]);
  const currency = { ...CurrencyValues };

  for (const [key, value] of sortedValues) {
    const total = Math.floor(clonedAmount / value);
    clonedAmount -= total * value;
    currency[key] = total;
  }
  return currency;
};
