import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} from "discord.js";

import { ExtendedClient } from "../../interfaces/ExtendedClient";
import { GuildButton } from "../../interfaces/GuildButton";
import { errorHandler } from "../../utils/errorHandler";

/**
 * Handles when the "Guess Word" button is clicked.
 *
 * @param {ExtendedClient} Melody The Melody's Discord instance.
 * @param {GuildButton} interaction The interaction payload from Discord.
 */
export const wordGuess = async (
  Melody: ExtendedClient,
  interaction: GuildButton
) => {
  try {
    const id = interaction.customId.split("-")[1];
    if (id !== interaction.user.id) {
      await interaction.reply({
        content: "Oh my, how on earth did you find this? This is not yours.",
        ephemeral: true
      });
      return;
    }
    if (!Melody.cache.wordGame[id]) {
      await interaction.reply({
        content:
          "This might be a stale message, as you don't have a game in the cache. Please start a new game.",
        ephemeral: true
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
    const row = new ActionRowBuilder<TextInputBuilder>().addComponents(input);
    const modal = new ModalBuilder()
      .setTitle("Guess the word!")
      .setCustomId(`word-${id}`)
      .addComponents(row);
    await interaction.showModal(modal);
  } catch (err) {
    await errorHandler(Melody, "word guess button", err);
    await interaction.editReply({
      content:
        "Forgive me, but I failed to complete your request. Please try again later."
    });
  }
};
