import { AutoModerationActionExecution } from "discord.js";

import { Responses } from "../config/Responses";
import { ExtendedClient } from "../interfaces/ExtendedClient";
import { errorHandler } from "../utils/errorHandler";

/**
 * Processes when someone triggers the Discord automod.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @param {AutoModerationActionExecution} action The action payload from Discord.
 */
export const autoModerationActionExecution = async (
  bot: ExtendedClient,
  action: AutoModerationActionExecution
) => {
  try {
    if (!process.env.AUTOMOD_TEASE_CHANNEL_ID) {
      return;
    }
    const { userId, guild } = action;
    if (bot.automod[userId] && bot.automod[userId] > Date.now() - 1000 * 60) {
      return;
    }
    bot.automod[userId] = Date.now();
    const channel =
      guild.channels.cache.get(process.env.AUTOMOD_TEASE_CHANNEL_ID) ||
      (await guild.channels.fetch(process.env.AUTOMOD_TEASE_CHANNEL_ID));
    if (!channel || !channel.isTextBased()) {
      return;
    }
    await channel.send({
      content:
        Responses.naughty[userId] ||
        `Oh dear, it would seem that <@${userId}> has been naughty.`,
      stickers: ["1146868650041675908"],
    });
  } catch (err) {
    await errorHandler(bot, "autoModerationActionExecution", err);
  }
};
