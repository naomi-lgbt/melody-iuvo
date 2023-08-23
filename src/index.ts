import { PrismaClient } from "@prisma/client";
import { ActivityType, Client, Events, GatewayIntentBits } from "discord.js";

import { Intents } from "./config/Intents";
import { clientReady } from "./events/clientReady";
import { interactionCreate } from "./events/interactionCreate";
import { messageCreate } from "./events/messageCreate";
import { ExtendedClient } from "./interfaces/ExtendedClient";
import { errorHandler } from "./utils/errorHandler";
import { loadCommands } from "./utils/loadCommands";
import { validateEnv } from "./utils/validateEnv";

(async () => {
  try {
    const bot = new Client({
      intents: Intents,
    }) as ExtendedClient;
    bot.env = validateEnv();
    bot.db = new PrismaClient();
    bot.cooldowns = {};
    bot.cache = {
      wordGame: {},
      slots: {},
    };
    bot.ticketLogs = {};
    await loadCommands(bot);

    bot.on(Events.InteractionCreate, async (interaction) => {
      await interactionCreate(bot, interaction);
    });

    bot.on(Events.ClientReady, async () => {
      await clientReady(bot);
    });

    bot.on(Events.MessageCreate, async (message) => {
      await messageCreate(bot, message);
    });

    await bot.login(bot.env.token);

    bot.user?.setActivity({
      name: "Custom Status",
      type: ActivityType.Custom,
      state: "I am Naomi's personal assistant.",
    });
  } catch (err) {
    const bot = new Client({
      intents: [GatewayIntentBits.Guilds],
    }) as ExtendedClient;
    bot.env = validateEnv();
    await errorHandler(bot, "entry file", err);
  }
})();
