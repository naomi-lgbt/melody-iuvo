import {
  ActionRowBuilder,
  Interaction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

import { ExtendedClient } from "../interfaces/ExtendedClient";
import { processWordGuess } from "../modules/processWordGuess";
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
    if (interaction.isChatInputCommand()) {
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
    }

    if (interaction.isButton()) {
      if (interaction.customId.startsWith("word-")) {
        const id = interaction.customId.split("-")[1];
        if (id !== interaction.user.id) {
          await interaction.reply({
            content:
              "Oh my, how on earth did you find this? This is not yours.",
            ephemeral: true,
          });
        }
        if (!bot.cache.wordGame[id]) {
          await interaction.reply({
            content:
              "This might be a stale message, as you don't have a game in the cache. Please start a new game.",
            ephemeral: true,
          });
          return;
        }
        const input = new TextInputBuilder()
          .setCustomId("guess")
          .setLabel("What is your guess?")
          .setStyle(TextInputStyle.Short)
          .setMinLength(5)
          .setMaxLength(5)
          .setRequired(true);
        const row = new ActionRowBuilder<TextInputBuilder>().addComponents(
          input
        );
        const modal = new ModalBuilder()
          .setTitle("Guess the word!")
          .setCustomId(`word-${id}`)
          .addComponents(row);
        await interaction.showModal(modal);
      }
    }
    if (interaction.isModalSubmit()) {
      if (interaction.customId.startsWith("word-")) {
        await interaction.deferReply({ ephemeral: true });
        await processWordGuess(bot, interaction);
      }
    }
  } catch (err) {
    await errorHandler(bot, "interaction create event", err);
  }
};
