import { WebhookClient } from "discord.js";

import { ExtendedClient } from "../interfaces/ExtendedClient";

/**
 * Validates that all environment variables are present.
 *
 * @returns { ExtendedClient["env"] } The bot's environment cache.
 */
export const validateEnv = (): ExtendedClient["env"] => {
  if (!process.env.TOKEN) {
    throw new Error("Missing TOKEN environment variable");
  }
  if (!process.env.HOME_GUILD_ID) {
    throw new Error("Missing HOME_GUILD_ID environment variable");
  }
  if (!process.env.DEBUG_HOOK) {
    throw new Error("Missing DEBUG_HOOK environment variable");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("Missing MONGO_URI environment variable");
  }
  return {
    token: process.env.TOKEN,
    homeGuild: process.env.HOME_GUILD_ID,
    debugHook: new WebhookClient({
      url: process.env.DEBUG_HOOK,
    }),
  };
};
