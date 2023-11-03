import { ChannelType } from "discord.js";

import { ExtendedClient } from "../interfaces/ExtendedClient";

import { errorHandler } from "./errorHandler";

/**
 * Fetches some Discord data to cache, avoiding extraneous API calls.
 * - Full member list (to ensure join/leave events work).
 * - General, Contributing, and Vent channels.
 * - Regular, Partner, Staff, and Donor roles.
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
        "Home guild not found. Channels and roles cannot be loaded."
      );
      return;
    }

    /**
     * Fetching the members on boot so we can have them in the cache.
     * This ensures that member leave/join events are not missed.
     */
    await homeGuild.members.fetch();

    const general = homeGuild.channels.cache.find(
      (c) => c.name === "mystic-circle"
    );
    if (!general || general.type !== ChannelType.GuildText) {
      await bot.env.debugHook.send(
        "General channel not found. Some features may not work."
      );
      return;
    }

    const contributing = homeGuild.channels.cache.find(
      (c) => c.name === "scribes-hall"
    );
    if (!contributing || contributing.type !== ChannelType.GuildText) {
      await bot.env.debugHook.send(
        "Contribute channel not found. Some features may not work."
      );
      return;
    }

    const vent = homeGuild.channels.cache.find((c) => c.name === "abyss");
    if (!vent || vent.type !== ChannelType.GuildText) {
      await bot.env.debugHook.send(
        "Vent channel not found. Some features may not work."
      );
      return;
    }

    const regular = homeGuild.roles.cache.find((r) => r.name === "Coven");
    if (!regular) {
      await bot.env.debugHook.send(
        "Regular role not found. Some features may not work."
      );
      return;
    }

    const partner = homeGuild.roles.cache.find((r) => r.name === "Concubine");
    if (!partner) {
      await bot.env.debugHook.send(
        "Partner role not found. Some features may not work."
      );
      return;
    }

    const staff = homeGuild.roles.cache.find((r) => r.name === "High Council");
    if (!staff) {
      await bot.env.debugHook.send(
        "Staff role not found. Some features may not work."
      );
      return;
    }

    const donor = homeGuild.roles.cache.find((r) => r.name === "Ritualist");
    if (!donor) {
      await bot.env.debugHook.send(
        "Donor role not found. Some features may not work."
      );
      return;
    }

    if (!bot.discord) {
      bot.discord = {
        guild: homeGuild,
        channels: {
          general,
          vent,
          contributing
        },
        roles: {
          staff,
          regular,
          donor,
          partner
        }
      };
      await bot.env.debugHook.send("Discord cache loaded~!");
      return;
    }
    await bot.env.debugHook.send(
      "Race condition when loading discord cache..."
    );
  } catch (err) {
    await errorHandler(bot, "load discord cache", err);
  }
};
