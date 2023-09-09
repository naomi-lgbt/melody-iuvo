import { GuildMember } from "discord.js";

import { ResponseIds, Responses } from "../config/Responses";

/**
 * Gets the correct key to be used to access the Responses object.
 *
 * @param {GuildMember} member The member payload from Discord.
 * @returns {string} The string to be used in accessing the Responses object.
 */
export const getResponseKey = (member: GuildMember): string => {
  if (member.id in Responses._template) {
    return member.id;
  }
  if (member.roles.cache.find((r) => r.name === "cutie")) {
    return ResponseIds.partnerRole;
  }
  return "default";
};
