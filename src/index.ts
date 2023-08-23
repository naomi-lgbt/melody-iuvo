import { Client, Events, GatewayIntentBits } from "discord.js";

import { Intents } from "./config/Intents";
import { ExtendedClient } from "./interfaces/ExtendedClient";
import { errorHandler } from "./utils/errorHandler";
import { loadCommands } from "./utils/loadCommands";
import { logHandler } from "./utils/logHandler";
import { registerCommands } from "./utils/registerCommands";
import { isGuildCommandCommand } from "./utils/typeGuards";
import { validateEnv } from "./utils/validateEnv";

(async () => {
  try {
    const bot = new Client({
      intents: Intents,
    }) as ExtendedClient;
    bot.env = validateEnv();
    await loadCommands(bot);

    bot.on(Events.InteractionCreate, async (interaction) => {
      try {
        if (!interaction.isChatInputCommand()) {
          return;
        }
        await interaction.deferReply();
        if (!isGuildCommandCommand(interaction)) {
          await interaction.editReply({
            content:
              "Forgive me, but this can only be done within Naomi's community.",
          });
          return;
        }
        const target = bot.commands.find(
          (c) => c.data.name === interaction.commandName
        );
        if (!target) {
          await interaction.editReply({
            content:
              "My deepest apologies, but I cannot follow those instructions at this time.",
          });
          return;
        }
        await target.run(bot, interaction);
      } catch (err) {
        await errorHandler(bot, "interaction create event", err);
      }
    });

    bot.on(Events.ClientReady, async () => {
      await registerCommands(bot);
      logHandler.log("info", "Bot is ready.");
    });

    await bot.login(bot.env.token);
  } catch (err) {
    const bot = new Client({
      intents: [GatewayIntentBits.Guilds],
    }) as ExtendedClient;
    bot.env = validateEnv();
    await errorHandler(bot, "entry file", err);
  }
})();
