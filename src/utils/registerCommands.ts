import { REST, Routes } from "discord.js";

import { ModerationCommands } from "../config/ModerationCommands";
import { ExtendedClient } from "../interfaces/ExtendedClient";

import { errorHandler } from "./errorHandler";

/**
 * Registers the loaded commands to Discord.
 *
 * @param {ExtendedClient} Melody The Melody's Discord instance.
 * @param {REST} restClass A mock REST client for testing.
 * @returns {Promise<REST>} The REST client, only for testing.
 */
export const registerCommands = async (
  Melody: ExtendedClient,
  restClass = REST
): Promise<REST | null> => {
  try {
    if (!Melody.user) {
      throw new Error("Melody is not logged in. Cannot register commands yet.");
    }
    const rest = new restClass({ version: "10" }).setToken(Melody.env.token);
    const commands = [
      ...Melody.commands.map((c) => c.data.toJSON()),
      ...Melody.contexts.map((c) => c.data),
      ...ModerationCommands.map((c) => c.toJSON())
    ];

    await rest.put(
      Routes.applicationGuildCommands(Melody.user.id, Melody.env.homeGuild),
      { body: commands }
    );
    return rest;
  } catch (err) {
    await errorHandler(Melody, "register commands utility", err);
    return null;
  }
};
