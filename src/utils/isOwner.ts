/**
 * Checks if a given user ID belongs to one of Naomi's accounts.
 *
 * @param {string} id The ID to check.
 * @returns {boolean} If the ID is Naomi.
 */
export const isOwner = (id: string) => ["465650873650118659"].includes(id);
