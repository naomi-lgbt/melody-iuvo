/**
 * Validates that the day provided is a valid day of the month.
 *
 * @param {string} month The month to validate.
 * @param {number} day The day to validate.
 * @returns {boolean} True if the day is within the month's range.
 */
export const validateDate = (month: string, day: number): boolean => {
  switch (month) {
    case "Jan":
    case "Mar":
    case "May":
    case "Jul":
    case "Aug":
    case "Oct":
    case "Dec":
      return day >= 1 && day <= 31;
    case "Feb":
      return day >= 1 && day <= 29;
    case "Apr":
    case "Jun":
    case "Sep":
    case "Nov":
      return day >= 1 && day <= 30;
    default:
      return false;
  }
};
