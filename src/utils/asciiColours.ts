/**
 * Wraps the string in Discord compliant ASCII colour codes.
 *
 * @param {string}  str The string to wrap.
 * @param {string} color The colour to make the string.
 * @returns {string} A formatted string.
 */
export const asciiColours = (
  str: string,
  color: "green" | "yellow" | "white" | "red"
) => {
  switch (color) {
    case "green":
      return `[2;36m${str}[0m`;
    case "yellow":
      return `[2;33m${str}[0m`;
    case "white":
      return `[2;37m${str}[0m`;
    case "red":
      return `[2;31m${str}[0m`;
    default:
      return str;
  }
};
