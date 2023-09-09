/**
 * Checks if a message matches a good morning greeting.
 *
 * @param {string} content The message content.
 * @returns {boolean} If the string matches.
 */
export const isGoodMorning = (content: string): boolean =>
  /good\s+(?:morning|day)|g'(?:morning|day)/i.test(content);

/**
 * Checks if a message matches a good night greeting.
 *
 * @param {string} content The message content.
 * @returns {boolean} If the string matches.
 */
export const isGoodNight = (content: string): boolean =>
  /good\s+night|g'night|night\s+night|nini/.test(content);

/**
 * Checks if a message is a thank you.
 *
 * @param {string} content The message content.
 * @returns {boolean} If the string matches.
 */
export const isThanks = (content: string): boolean =>
  /(?<!no\s*)thanks|(?<!no\s*)thank\s+you|(?<!no\s*)thankies|(?<!no\s*)\bty\b|(?<!no\s*)\bthx\b/.test(
    content
  );
