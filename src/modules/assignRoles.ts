import { GuildMember } from "discord.js";

import { ExtendedClient } from "../interfaces/ExtendedClient";
import { errorHandler } from "../utils/errorHandler";

/**
 * Assigns all the necessary roles to members.
 *
 * @param {ExtendedClient} Melody The Melody's Discord instance.
 * @param {GuildMember} member The guild member.
 */
export const assignRoles = async (
  Melody: ExtendedClient,
  member: GuildMember
) => {
  try {
    const dividers = member.guild.roles.cache.filter((r) =>
      r.name.startsWith("─")
    );
    for (const [, role] of dividers) {
      if (!member.roles.cache.has(role.id)) {
        await member.roles.add(role).catch(() => null);
      }
    }
    const acolyte = member.guild.roles.cache.find((r) => r.name === "Acolyte");
    if (acolyte && !member.roles.cache.has(acolyte.id)) {
      await member.roles.add(acolyte).catch(() => null);
    }
  } catch (err) {
    await errorHandler(Melody, "assign roles", err);
  }
};
