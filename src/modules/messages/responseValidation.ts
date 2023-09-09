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
  /good\s+night|g'night|night\s+night|nini/i.test(content);

/**
 * Checks if a message is a thank you.
 *
 * @param {string} content The message content.
 * @returns {boolean} If the string matches.
 */
export const isThanks = (content: string): boolean =>
  /(?<!no\s*)thanks|(?<!no\s*)thank\s+you|(?<!no\s*)thankies|(?<!no\s*)\bty\b|(?<!no\s*)\bthx\b/i.test(
    content
  );

/**
 * Checks if a message is an apology.
 *
 * @param {string} content The message content.
 * @returns {boolean} If the string matches.
 */
export const isSorry = (content: string): boolean =>
  /(?<!not\s*)sorry|(?<!no\s*)apologies|i\s+apologise|my\s+bad|oops|oopsie|(?<!not?\s*)sowwy/i.test(
    content
  );
