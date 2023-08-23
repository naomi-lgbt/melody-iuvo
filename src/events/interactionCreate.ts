import { Interaction } from "discord.js";

import { ExtendedClient } from "../interfaces/ExtendedClient";
import { errorHandler } from "../utils/errorHandler";
import { isGuildCommandCommand } from "../utils/typeGuards";

/**
 * Handles the InteractionCreate event from Discord.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @param {Interaction} interaction The interaction payload from Discord.
 */
export const interactionCreate = async (
  bot: ExtendedClient,
  interaction: Interaction
) => {
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
};
