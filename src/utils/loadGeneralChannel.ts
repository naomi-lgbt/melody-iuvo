import { ChannelType } from "discord.js";

import { ExtendedClient } from "../interfaces/ExtendedClient";

import { errorHandler } from "./errorHandler";

/**
 * Fetches the general channel from the home guild and mounts it
 * to the bot. This avoids excessive API calls for other logic.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 */
export const loadGeneralChannel = async (bot: ExtendedClient) => {
  try {
    const homeGuild =
      bot.guilds.cache.get(bot.env.homeGuild) ||
      (await bot.guilds.fetch(bot.env.homeGuild));
    if (!homeGuild) {
      await bot.env.debugHook.send(
        "Home guild not found. General channel cannot be loaded."
      );
      return;
    }

    const channel = homeGuild.channels.cache.find((c) => c.name === "testing");
    if (!channel || channel.type !== ChannelType.GuildText) {
      await bot.env.debugHook.send(
        "General channel not found. Some features may not work."
      );
      return;
    }
    if (!bot.general) {
      bot.general = channel;
    }
  } catch (err) {
    await errorHandler(bot, "load general channel", err);
  }
};
