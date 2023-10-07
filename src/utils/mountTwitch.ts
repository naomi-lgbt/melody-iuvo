import { ApiClient } from "@twurple/api";
import { StaticAuthProvider } from "@twurple/auth";
import { EventSubWsListener } from "@twurple/eventsub-ws";

import { ExtendedClient } from "../interfaces/ExtendedClient";

import { errorHandler } from "./errorHandler";

/**
 * Mounts the listeners for the Twitch stream.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 */
export const mountTwitch = async (bot: ExtendedClient) => {
  try {
    if (!process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_ACCESS_TOKEN) {
      await bot.env.debugHook.send(
        "Twitch client ID or access token not found. Twitch will not be loaded. To generate an access token, run `pnpm run twitch-auth`"
      );
      return;
    }
    const homeGuild =
      bot.guilds.cache.get(bot.env.homeGuild) ||
      (await bot.guilds.fetch(bot.env.homeGuild));
    if (!homeGuild) {
      await bot.env.debugHook.send(
        "Home guild not found. Twitch will not be loaded."
      );
      return;
    }

    const channel = homeGuild.channels.cache.find((c) => c.name === "general");
    if (!channel || !channel.isTextBased()) {
      await bot.env.debugHook.send(
        "General channel not found. Twitch will not be loaded."
      );
      return;
    }
    const auth = new StaticAuthProvider(
      process.env.TWITCH_CLIENT_ID,
      process.env.TWITCH_ACCESS_TOKEN
    );
    const client = new ApiClient({ authProvider: auth });
    const listener = new EventSubWsListener({ apiClient: client });
    listener.onStreamOnline("592893397", async (e) => {
      const stream = await e.getStream();
      const result = await channel.send(
        stream
          ? `# ${stream.title}\n\n<@!1154535918930231326>, Naomi has gone live! She's playing ${stream.gameName}. Watch her stream: https://twitch.tv/naomilgbt`
          : "<@!1154535918930231326>, Naomi has gone live!\n\nWatch her stream: https://twitch.tv/naomilgbt"
      );
      bot.twitchNotif = result;
    });
    listener.onStreamOffline("592893397", async (e) => {
      if (bot.twitchNotif) {
        const broadcaster = await e.getBroadcaster();
        const vod = await client.videos
          .getVideosByUser(broadcaster.id, {
            limit: 1,
          })
          .catch(() => ({
            data: [{ url: "https://twitch.tv/naomilgbt/videos" }],
          }));
        await bot.twitchNotif.edit({
          content: `Naomi has gone offline. Watch her latest VOD: ${vod.data[0].url}`,
        });
      }
      delete bot.twitchNotif;
    });
    listener.start();
  } catch (err) {
    await errorHandler(bot, "mount twitch", err);
  }
};
