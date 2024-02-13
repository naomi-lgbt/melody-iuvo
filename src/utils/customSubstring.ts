/**
 * Utility to truncate a string and append ellipsis, but only
 * if string exceeds the given length.
 *
 * @param {string} str The string to truncate.
 * @param {number} len The maximum length to allow for the string.
 * @returns {string} The truncated string.
 */
export const customSubstring = (str: string, len: number): string => {
  return str.length > len ? str.substring(0, len - 3) + "..." : str;
};
