/**
 * Generates a random number between 50 and 100,
 * then multiplies it by the length of the message divided by 10.
 *
 * @param {string} content The content of the message.
 * @returns {number} How much currency to award for the message.
 */
export const calculateMessageCurrency = (content: string) =>
  (Math.floor(Math.random() * 50) + 50) *
  (Math.floor(content.length / 10) || 1);
