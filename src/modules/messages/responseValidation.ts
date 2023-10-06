/**
 * Checks if a message matches a good morning greeting.
 *
 * @param {string} content The message content.
 * @returns {boolean} If the string matches.
 */
export const isGoodMorning = (content: string): boolean =>
  /\b(?:good\s+(?:morning|day)|g'(?:morning|day))\b/i.test(content);

/**
 * Checks if a message matches a good night greeting.
 *
 * @param {string} content The message content.
 * @returns {boolean} If the string matches.
 */
export const isGoodNight = (content: string): boolean =>
  /\b(?:good\s+night|g'night|night\s+night|nini)\b/i.test(content);

/**
 * Checks if a message is a thank you.
 *
 * @param {string} content The message content.
 * @returns {boolean} If the string matches.
 */
export const isThanks = (content: string): boolean =>
  /\b(?:(?<!no\s*)thanks|(?<!no\s*)thank\s+you|(?<!no\s*)thankies|(?<!no\s*)ty|(?<!no\s*)thx)\b/i.test(
    content
  );

/**
 * Checks if a message is an apology.
 *
 * @param {string} content The message content.
 * @returns {boolean} If the string matches.
 */
export const isSorry = (content: string): boolean =>
  /\b(?:(?<!not\s*)sorry|(?<!no\s*)apologies|i\s+apologise|my\s+bad|oops|oopsie|(?<!not?\s*)sowwy)\b/i.test(
    content
  );
