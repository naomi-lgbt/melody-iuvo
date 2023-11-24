import { ChannelType, GuildTextBasedChannel } from "discord.js";

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
      (await bot.guilds.fetch(bot.env.homeGuild).catch(() => null));
    if (!homeGuild) {
      await bot.env.debugHook.send(
        "Home guild not found. Channels and roles cannot be loaded."
      );
    }

    /**
     * Fetching the members and roles on boot so we can have them in the cache.
     * This ensures that member leave/join events are not missed.
     */
    await homeGuild?.members.fetch();
    await homeGuild?.roles.fetch();

    const general =
      (homeGuild?.channels.cache.find(
        (c) => c.name === "the-grove"
      ) as GuildTextBasedChannel) ?? null;
    if (!general || general.type !== ChannelType.GuildText) {
      await bot.env.debugHook.send(
        "General channel not found. Some features may not work."
      );
    }

    const contributing =
      (homeGuild?.channels.cache.find(
        (c) => c.name === "the-grove"
      ) as GuildTextBasedChannel) ?? null;
    if (!contributing || contributing.type !== ChannelType.GuildText) {
      await bot.env.debugHook.send(
        "Contribute channel not found. Some features may not work."
      );
    }

    const vent =
      (homeGuild?.channels.cache.find(
        (c) => c.name === "abyss"
      ) as GuildTextBasedChannel) ?? null;
    if (!vent || vent.type !== ChannelType.GuildText) {
      await bot.env.debugHook.send(
        "Vent channel not found. Some features may not work."
      );
    }

    const regular =
      homeGuild?.roles.cache.find((r) => r.name === "Coven") ?? null;
    if (!regular) {
      await bot.env.debugHook.send(
        "Regular role not found. Some features may not work."
      );
    }

    const partner =
      homeGuild?.roles.cache.find((r) => r.name === "Handfasted") ?? null;
    if (!partner) {
      await bot.env.debugHook.send(
        "Partner role not found. Some features may not work."
      );
    }

    const staff =
      homeGuild?.roles.cache.find((r) => r.name === "High Council") ?? null;
    if (!staff) {
      await bot.env.debugHook.send(
        "Staff role not found. Some features may not work."
      );
    }

    const donor =
      homeGuild?.roles.cache.find((r) => r.name === "Ritualist") ?? null;
    if (!donor) {
      await bot.env.debugHook.send(
        "Donor role not found. Some features may not work."
      );
    }
    bot.discord = {
      guild: homeGuild,
      channels: {
        general: general,
        vent: vent,
        contributing: contributing
      },
      roles: {
        staff: staff,
        regular: regular,
        donor: donor,
        partner: partner
      }
    };
    await bot.env.debugHook.send("Discord cache loaded~!");
  } catch (err) {
    await errorHandler(bot, "load discord cache", err);
  }
};
