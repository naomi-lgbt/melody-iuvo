/**
 * Prepends a hash to a hex string if it doesn't already have one.
 *
 * @param {string} hex The hex to prefix.
 * @returns {string} The prefixed hex.
 */
export const prefixHex = (hex: string) => (hex.length === 6 ? `#${hex}` : hex);
