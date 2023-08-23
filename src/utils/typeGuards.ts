import { ChatInputCommandInteraction } from "discord.js";

import { GuildCommand } from "../interfaces/GuildCommand";

/**
 * Validates that a command command was used within a guild.
 *
 * @param {ChatInputCommandInteraction} command The interaction payload from Discord.
 * @returns {boolean} If the guild property is not null.
 */
export const isGuildCommandCommand = (
  command: ChatInputCommandInteraction
): command is GuildCommand =>
  !!command.guild &&
  !!command.member &&
  typeof command.member.permissions !== "string";
