import { ChannelType } from "discord.js";

import { ExtendedClient } from "../interfaces/ExtendedClient";

import { errorHandler } from "./errorHandler";

/**
 * Fetches some Discord data to cache, avoiding extraneous API calls.
 * - General channel.
 * - Full member list (to ensure join/leave events work).
 * - Coven role.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 */
export const loadDiscordCache = async (bot: ExtendedClient) => {
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

    /**
     * Fetching the members on boot so we can have them in the cache.
     * This ensures that member leave/join events are not missed.
     */
    await homeGuild.members.fetch();

    const channel = homeGuild.channels.cache.find(
      (c) => c.name === "mystic-circle"
    );
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
