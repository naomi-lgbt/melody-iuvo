import { GuildMember } from "discord.js";

/**
 * Used to check if a member has the cutie role. Returns a string
 * to be used in accessing the Responses object.
 *
 * @param {GuildMember} member The member payload from Discord.
 * @returns {string} The string to be used in accessing the Responses object.
 */
export const parseCutieRole = (member: GuildMember) =>
  member.roles.cache.find((r) => r.name === "cutie") ? "cutie" : "nope";
