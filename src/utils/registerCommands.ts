import { REST, Routes } from "discord.js";

import { ExtendedClient } from "../interfaces/ExtendedClient";

import { errorHandler } from "./errorHandler";

/**
 * Registers the loaded commands to Discord.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @param {REST} restClass A mock REST client for testing.
 * @returns {Promise<REST>} The REST client, only for testing.
 */
export const registerCommands = async (
  bot: ExtendedClient,
  restClass = REST
): Promise<REST | null> => {
  try {
    if (!bot.user) {
      throw new Error("Bot is not logged in. Cannot register commands yet.");
    }
    const rest = new restClass({ version: "10" }).setToken(bot.env.token);
    const commands = bot.commands.map((c) => c.data.toJSON());

    await rest.put(
      Routes.applicationGuildCommands(bot.user.id, bot.env.homeGuild),
      { body: commands }
    );
    return rest;
  } catch (err) {
    await errorHandler(bot, "register commands utility", err);
    return null;
  }
};
