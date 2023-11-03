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
        "Home guild not found. General channel cannot be loaded."
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
    if (!bot.discord.channels.general) {
      bot.discord.channels.general = general;
    }

    const contribute = homeGuild.channels.cache.find(
      (c) => c.name === "scribes-hall"
    );
    if (!contribute || contribute.type !== ChannelType.GuildText) {
      await bot.env.debugHook.send(
        "Contribute channel not found. Some features may not work."
      );
      return;
    }
    if (!bot.discord.channels.contributing) {
      bot.discord.channels.contributing = contribute;
    }

    const vent = homeGuild.channels.cache.find((c) => c.name === "abyss");
    if (!vent || vent.type !== ChannelType.GuildText) {
      await bot.env.debugHook.send(
        "Vent channel not found. Some features may not work."
      );
      return;
    }
    if (!bot.discord.channels.vent) {
      bot.discord.channels.vent = vent;
    }

    const regular = homeGuild.roles.cache.find((r) => r.name === "Coven");
    if (!regular) {
      await bot.env.debugHook.send(
        "Regular role not found. Some features may not work."
      );
      return;
    }
    if (!bot.discord.roles.regular) {
      bot.discord.roles.regular = regular;
    }

    const partner = homeGuild.roles.cache.find((r) => r.name === "Concubine");
    if (!partner) {
      await bot.env.debugHook.send(
        "Partner role not found. Some features may not work."
      );
      return;
    }
    if (!bot.discord.roles.partner) {
      bot.discord.roles.partner = partner;
    }

    const staff = homeGuild.roles.cache.find((r) => r.name === "High Council");
    if (!staff) {
      await bot.env.debugHook.send(
        "Staff role not found. Some features may not work."
      );
      return;
    }
    if (!bot.discord.roles.staff) {
      bot.discord.roles.staff = staff;
    }

    const donor = homeGuild.roles.cache.find((r) => r.name === "Ritualist");
    if (!donor) {
      await bot.env.debugHook.send(
        "Donor role not found. Some features may not work."
      );
      return;
    }
    if (!bot.discord.roles.donor) {
      bot.discord.roles.donor = donor;
    }
  } catch (err) {
    await errorHandler(bot, "load general channel", err);
  }
};
