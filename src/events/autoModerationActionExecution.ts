import { AutoModerationActionExecution } from "discord.js";

import { Responses } from "../config/Responses";
import { ExtendedClient } from "../interfaces/ExtendedClient";
import { getResponseKey } from "../modules/getResponseKey";
import { errorHandler } from "../utils/errorHandler";
import { getRandomValue } from "../utils/getRandomValue";

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
    const { userId, guild } = action;
    const member =
      action.member ||
      guild.members.cache.get(userId) ||
      (await guild.members.fetch(userId).catch(() => null));
    if (!member) {
      return;
    }
    const cached = bot.automod[userId];
    if (cached && cached > Date.now() - 1000 * 60) {
      return;
    }
    bot.automod[userId] = Date.now();
    await bot.discord.channels.general?.send({
      content: getRandomValue(
        Responses.naughty[getResponseKey(bot, member)]
      ).replace(/\{userping\}/g, `<@${userId}>`),
    });
  } catch (err) {
    await errorHandler(bot, "autoModerationActionExecution", err);
  }
};
