import { GuildMember } from "discord.js";

import { ResponseIds, Responses } from "../config/Responses";
import { ExtendedClient } from "../interfaces/ExtendedClient";

/**
 * Gets the correct key to be used to access the Responses object.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @param {GuildMember} member The member payload from Discord.
 * @returns {string} The string to be used in accessing the Responses object.
 */
export const getResponseKey = (
  bot: ExtendedClient,
  member: GuildMember
): ResponseIds => {
  if (member.id in Responses._template) {
    return member.id as ResponseIds;
  }
  if (member.roles.cache.has(bot.partner.id)) {
    return ResponseIds.partnerRole;
  }
  return ResponseIds.default;
};
