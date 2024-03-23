import { AutoModerationActionExecution } from "discord.js";

import { Responses } from "../config/Responses";
import { ExtendedClient } from "../interfaces/ExtendedClient";
import { getResponseKey } from "../modules/getResponseKey";
import { errorHandler } from "../utils/errorHandler";
import { getRandomValue } from "../utils/getRandomValue";

/**
 * Processes when someone triggers the Discord automod.
 *
 * @param {ExtendedClient} Melody The Melody's Discord instance.
 * @param {AutoModerationActionExecution} action The action payload from Discord.
 */
export const autoModerationActionExecution = async (
  Melody: ExtendedClient,
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
    const cached = Melody.automod[userId];
    if (cached && cached > Date.now() - 1000 * 60) {
      return;
    }
    Melody.automod[userId] = Date.now();
    await Melody.discord.channels.general?.send({
      content: getRandomValue(
        Responses.naughty[getResponseKey(Melody, member)]
      ).replace(/\{userping\}/g, `<@${userId}>`)
    });
  } catch (err) {
    await errorHandler(Melody, "autoModerationActionExecution", err);
  }
};
