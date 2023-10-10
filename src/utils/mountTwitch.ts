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
    const auth = new StaticAuthProvider(
      process.env.TWITCH_CLIENT_ID,
      process.env.TWITCH_ACCESS_TOKEN
    );
    const client = new ApiClient({ authProvider: auth });
    const listener = new EventSubWsListener({ apiClient: client });
    listener.onStreamOnline("592893397", async (e) => {
      if (bot.twitchNotif) {
        await bot.twitchNotif.unpin().catch(() => null);
      }
      const stream = await e.getStream();
      const result = await bot.general.send(
        stream
          ? `# ${stream.title}\n\n<@&1160803262828642357>, Naomi has gone live! She's playing ${stream.gameName}. Watch her stream: https://twitch.tv/naomilgbt`
          : "<@&1160803262828642357>, Naomi has gone live!\n\nWatch her stream: https://twitch.tv/naomilgbt"
      );
      if (bot.twitchNotif?.id !== result.id) {
        bot.twitchNotif = result;
        await result.pin().catch(() => null);
      }
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
    });
    listener.start();
  } catch (err) {
    await errorHandler(bot, "mount twitch", err);
  }
};
