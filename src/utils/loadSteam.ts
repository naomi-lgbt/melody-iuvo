import { ExtendedClient } from "../interfaces/ExtendedClient";
import { SteamResponse } from "../interfaces/SteamGame";

import { errorHandler } from "./errorHandler";

/**
 * Fetches Naomi's list of steam games, and loads them into the bot.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 */
export const loadSteam = async (bot: ExtendedClient) => {
  try {
    if (!process.env.STEAM_KEY) {
      bot.games = [];
      await bot.env.debugHook.send("No steam key present. Skipping game load.");
    }
    const raw = await fetch(
      `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAM_KEY}&steamid=76561198011176280&format=json`
    );
    const json = (await raw.json()) as SteamResponse;
    if (!bot.games) {
      bot.games = json.response.games;
    }
  } catch (err) {
    bot.games = [];
    await errorHandler(bot, "load steam", err);
  }
};
