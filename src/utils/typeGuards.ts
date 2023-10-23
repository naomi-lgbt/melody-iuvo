import {
  ButtonInteraction,
  ChatInputCommandInteraction,
  Message
} from "discord.js";

import { AssetTarget } from "../interfaces/Asset";
import { GuildButton } from "../interfaces/GuildButton";
import { GuildCommand } from "../interfaces/GuildCommand";
import { GuildMessage } from "../interfaces/GuildMessage";

/**
 * Validates that a command command was used within a guild.
 *
 * @param {ChatInputCommandInteraction} command The interaction payload from Discord.
 * @returns {boolean} If the guild property is not null.
 */
export const isGuildSlashCommand = (
  command: ChatInputCommandInteraction
): command is GuildCommand =>
  !!command.guild &&
  !!command.member &&
  typeof command.member.permissions !== "string";

/**
 * Validates that a button command was used within a guild.
 *
 * @param {ButtonInteraction} command The interaction payload from Discord.
 * @returns {boolean} If the guild property is not null.
 */
export const isGuildButtonCommand = (
  command: ButtonInteraction
): command is GuildButton =>
  !!command.guild &&
  !!command.member &&
  typeof command.member.permissions !== "string";

/**
 * Validates that a message was sent within a guild.
 *
 * @param {Message} message The message payload from discord.
 * @returns {boolean} If the guild and member properties exist.
 */
export const isGuildMessage = (message: Message): message is GuildMessage =>
  !!message.guild && !!message.member;

/**
 * Validates that a string is an asset target. Allows filtering to
 * specific targets.
 *
 * @param {string} target The target to validate.
 * @param {AssetTarget[]} validTargets Array of valid targets.
 * @returns {boolean} If the target is a valid target.
 */
export const isAssetTarget = (
  target: string,
  validTargets: AssetTarget[]
): target is AssetTarget => validTargets.includes(target as AssetTarget);
