/**
 * Checks if a string is a valid hex color.
 *
 * @param {string} hex The string to check.
 * @returns {boolean} If the string is a valid hex color.
 */
export const isValidHex = (hex?: string | null): hex is string =>
  !!hex &&
  (hex.length === 6 || hex.length === 7) &&
  /^#?[0-9A-F]{6}$/i.test(hex);
