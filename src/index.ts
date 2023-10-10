import { execSync } from "child_process";

import { PrismaClient } from "@prisma/client";
import { ActivityType, Client, Events, GatewayIntentBits } from "discord.js";

import { Intents } from "./config/Intents";
import { autoModerationActionExecution } from "./events/autoModerationActionExecution";
import { clientReady } from "./events/clientReady";
import { interactionCreate } from "./events/interactionCreate";
import { messageCreate } from "./events/messageCreate";
import { voiceStateUpdate } from "./events/voiceStateUpdate";
import { ExtendedClient } from "./interfaces/ExtendedClient";
import { errorHandler } from "./utils/errorHandler";
import { loadCommands } from "./utils/loadCommands";
import { validateEnv } from "./utils/validateEnv";

(async () => {
  try {
    /**
     * Initial setup.
     */
    const bot = new Client({
      intents: Intents,
    }) as ExtendedClient;
    bot.env = validateEnv();

    /**
     * Fallthrough error handlers. These fire in rare cases where something throws
     * in a way that our standard catch block cannot see it.
     */
    process.on("unhandledRejection", async (error: Error) => {
      await errorHandler(bot, "Unhandled Rejection Error", error);
    });

    process.on("uncaughtException", async (error) => {
      await errorHandler(bot, "Uncaught Exception Error", error);
    });

    /**
     * Instantiate empty cache objects for later use.
     */
    bot.db = new PrismaClient();
    bot.cooldowns = {};
    bot.automod = {};
    bot.cache = {
      wordGame: {},
      slots: {},
      tarot: {},
    };
    bot.commit = execSync("git rev-parse HEAD").toString().trim();
    bot.ticketLogs = {};
    await loadCommands(bot);

    /**
     * Mount event handlers.
     */
    bot.on(Events.InteractionCreate, async (interaction) => {
      await interactionCreate(bot, interaction);
    });

    bot.on(Events.ClientReady, async () => {
      await clientReady(bot);
    });

    bot.on(Events.MessageCreate, async (message) => {
      await messageCreate(bot, message);
    });

    bot.on(Events.AutoModerationActionExecution, async (action) => {
      await autoModerationActionExecution(bot, action);
    });

    bot.on(Events.VoiceStateUpdate, async (oldState, newState) => {
      await voiceStateUpdate(bot, oldState, newState);
    });

    bot.on(Events.GuildMemberAdd, async (member) => {
      await bot.general.send({
        content: `## <a:love:1149580277220388985> Give a warm welcome to ${member.user.username}, the newest member of our comfy corner! <a:love:1149580277220388985>`,
      });
    });

    bot.on(Events.GuildMemberRemove, async (member) => {
      await bot.general.send({
        content: `## <a:love:1149580277220388985> Good bye dearest ${member.user.username}. We will miss you! <a:love:1149580277220388985>`,
      });
    });

    /**
     * Connect to Discord.
     */
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
