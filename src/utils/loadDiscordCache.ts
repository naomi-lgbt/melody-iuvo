import { ChannelType, GuildTextBasedChannel } from "discord.js";

import { ExtendedClient } from "../interfaces/ExtendedClient";

import { errorHandler } from "./errorHandler";

/**
 * Fetches some Discord data to cache, avoiding extraneous API calls.
 * - Full member list (to ensure join/leave events work).
 * - General, Contributing, and Vent channels.
 * - Regular, Partner, Staff, and Donor roles.
 *
 * @param {ExtendedClient} Melody The Melody's Discord instance.
 */
export const loadDiscordCache = async (Melody: ExtendedClient) => {
  try {
    const homeGuild =
      Melody.guilds.cache.get(Melody.env.homeGuild) ||
      (await Melody.guilds.fetch(Melody.env.homeGuild).catch(() => null));
    if (!homeGuild) {
      await Melody.env.debugHook.send({
        content: "Home guild not found. Channels and roles cannot be loaded.",
        username: Melody.user?.username ?? "Melody",
        avatarURL:
          Melody.user?.displayAvatarURL() ??
          "https://cdn.nhcarrigan.com/avatars/nhcarrigan.png"
      });
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
      await Melody.env.debugHook.send({
        content: "General channel not found. Some features may not work.",
        username: Melody.user?.username ?? "Melody",
        avatarURL:
          Melody.user?.displayAvatarURL() ??
          "https://cdn.nhcarrigan.com/avatars/nhcarrigan.png"
      });
    }

    const contributing =
      (homeGuild?.channels.cache.find(
        (c) => c.name === "the-grove"
      ) as GuildTextBasedChannel) ?? null;
    if (!contributing || contributing.type !== ChannelType.GuildText) {
      await Melody.env.debugHook.send({
        content: "Contribute channel not found. Some features may not work.",
        username: Melody.user?.username ?? "Melody",
        avatarURL:
          Melody.user?.displayAvatarURL() ??
          "https://cdn.nhcarrigan.com/avatars/nhcarrigan.png"
      });
    }

    const vent =
      (homeGuild?.channels.cache.find(
        (c) => c.name === "abyss"
      ) as GuildTextBasedChannel) ?? null;
    if (!vent || vent.type !== ChannelType.GuildText) {
      await Melody.env.debugHook.send({
        content: "Vent channel not found. Some features may not work.",
        username: Melody.user?.username ?? "Melody",
        avatarURL:
          Melody.user?.displayAvatarURL() ??
          "https://cdn.nhcarrigan.com/avatars/nhcarrigan.png"
      });
    }

    const modLog =
      (homeGuild?.channels.cache.find(
        (c) => c.name === "coven-logs"
      ) as GuildTextBasedChannel) ?? null;
    if (!modLog || modLog.type !== ChannelType.GuildText) {
      await Melody.env.debugHook.send({
        content: "Mod log channel not found. Some features may not work.",
        username: Melody.user?.username ?? "Melody",
        avatarURL:
          Melody.user?.displayAvatarURL() ??
          "https://cdn.nhcarrigan.com/avatars/nhcarrigan.png"
      });
    }

    const publicModLog =
      (homeGuild?.channels.cache.find(
        (c) => c.name === "council-activity"
      ) as GuildTextBasedChannel) ?? null;
    if (!publicModLog || publicModLog.type !== ChannelType.GuildText) {
      await Melody.env.debugHook.send({
        content:
          "Public mod log channel not found. Some features may not work.",
        username: Melody.user?.username ?? "Melody",
        avatarURL:
          Melody.user?.displayAvatarURL() ??
          "https://cdn.nhcarrigan.com/avatars/nhcarrigan.png"
      });
    }

    const training =
      (homeGuild?.channels.cache.find(
        (c) => c.name === "training-grounds"
      ) as GuildTextBasedChannel) ?? null;
    if (!training || training.type !== ChannelType.GuildText) {
      await Melody.env.debugHook.send({
        content: "Training channel not found. Some features may not work.",
        username: Melody.user?.username ?? "Melody",
        avatarURL:
          Melody.user?.displayAvatarURL() ??
          "https://cdn.nhcarrigan.com/avatars/nhcarrigan.png"
      });
    }

    const partners =
      (homeGuild?.channels.cache.find(
        (c) => c.name === "partners"
      ) as GuildTextBasedChannel) ?? null;
    if (!partners || partners.type !== ChannelType.GuildText) {
      await Melody.env.debugHook.send({
        content: "Partners channel not found. Some features may not work.",
        username: Melody.user?.username ?? "Melody",
        avatarURL:
          Melody.user?.displayAvatarURL() ??
          "https://cdn.nhcarrigan.com/avatars/nhcarrigan.png"
      });
    }

    const member =
      homeGuild?.roles.cache.find((r) => r.name === "Acolyte") ?? null;
    if (!member) {
      await Melody.env.debugHook.send({
        content: "Member role not found. Some features may not work.",
        username: Melody.user?.username ?? "Melody",
        avatarURL:
          Melody.user?.displayAvatarURL() ??
          "https://cdn.nhcarrigan.com/avatars/nhcarrigan.png"
      });
    }

    const regular =
      homeGuild?.roles.cache.find((r) => r.name === "Coven") ?? null;
    if (!regular) {
      await Melody.env.debugHook.send({
        content: "Regular role not found. Some features may not work.",
        username: Melody.user?.username ?? "Melody",
        avatarURL:
          Melody.user?.displayAvatarURL() ??
          "https://cdn.nhcarrigan.com/avatars/nhcarrigan.png"
      });
    }

    const partner =
      homeGuild?.roles.cache.find((r) => r.name === "NaomiCule") ?? null;
    if (!partner) {
      await Melody.env.debugHook.send({
        content: "Partner role not found. Some features may not work.",
        username: Melody.user?.username ?? "Melody",
        avatarURL:
          Melody.user?.displayAvatarURL() ??
          "https://cdn.nhcarrigan.com/avatars/nhcarrigan.png"
      });
    }

    const friend =
      homeGuild?.roles.cache.find((r) => r.name === "Supplicant") ?? null;
    if (!friend) {
      await Melody.env.debugHook.send({
        content: "Friend role not found. Some features may not work.",
        username: Melody.user?.username ?? "Melody",
        avatarURL:
          Melody.user?.displayAvatarURL() ??
          "https://cdn.nhcarrigan.com/avatars/nhcarrigan.png"
      });
    }

    const staff =
      homeGuild?.roles.cache.find((r) => r.name === "High Council") ?? null;
    if (!staff) {
      await Melody.env.debugHook.send({
        content: "Staff role not found. Some features may not work.",
        username: Melody.user?.username ?? "Melody",
        avatarURL:
          Melody.user?.displayAvatarURL() ??
          "https://cdn.nhcarrigan.com/avatars/nhcarrigan.png"
      });
    }

    const donor =
      homeGuild?.roles.cache.find((r) => r.name === "Ritualist") ?? null;
    if (!donor) {
      await Melody.env.debugHook.send({
        content: "Donor role not found. Some features may not work.",
        username: Melody.user?.username ?? "Melody",
        avatarURL:
          Melody.user?.displayAvatarURL() ??
          "https://cdn.nhcarrigan.com/avatars/nhcarrigan.png"
      });
    }

    const mentee =
      homeGuild?.roles.cache.find((r) => r.name === "Neophyte") ?? null;
    if (!mentee) {
      await Melody.env.debugHook.send({
        content: "Mentee role not found. Some features may not work.",
        username: Melody.user?.username ?? "Melody",
        avatarURL:
          Melody.user?.displayAvatarURL() ??
          "https://cdn.nhcarrigan.com/avatars/nhcarrigan.png"
      });
    }

    const awakened =
      homeGuild?.roles.cache.find((r) => r.name === "Awakened") ?? null;
    if (!awakened) {
      await Melody.env.debugHook.send({
        content: "Awakened role not found. Some features may not work.",
        username: Melody.user?.username ?? "Melody",
        avatarURL:
          Melody.user?.displayAvatarURL() ??
          "https://cdn.nhcarrigan.com/avatars/nhcarrigan.png"
      });
    }

    Melody.discord = {
      guild: homeGuild,
      channels: {
        general,
        vent,
        contributing,
        partners,
        training,
        modLog,
        publicModLog
      },
      roles: {
        staff,
        regular,
        friend,
        donor,
        partner,
        mentee,
        awakened,
        member
      }
    };
    await Melody.env.debugHook.send({
      content: "Discord cache loaded~!",
      username: Melody.user?.username ?? "Melody",
      avatarURL:
        Melody.user?.displayAvatarURL() ??
        "https://cdn.nhcarrigan.com/avatars/nhcarrigan.png"
    });
  } catch (err) {
    await errorHandler(Melody, "load discord cache", err);
  }
};
