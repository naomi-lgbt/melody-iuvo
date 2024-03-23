import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} from "discord.js";

import { ExtendedClient } from "../../interfaces/ExtendedClient";
import { GuildButton } from "../../interfaces/GuildButton";
import { errorHandler } from "../../utils/errorHandler";
import { isOwner } from "../../utils/isOwner";

/**
 * Handles when the "Answer Question" button is clicked.
 *
 * @param {ExtendedClient} Melody The Melody's Discord instance.
 * @param {GuildButton} interaction The interaction payload from Discord.
 */
export const questionAnswer = async (
  Melody: ExtendedClient,
  interaction: GuildButton
) => {
  try {
    if (!isOwner(interaction.user.id)) {
      await interaction.reply({
        content: "Only Mama Naomi can click these buttons.",
        ephemeral: true
      });
      return;
    }
    const input = new TextInputBuilder()
      .setCustomId("answer")
      .setLabel("How do you answer?")
      .setMaxLength(2000)
      .setRequired(true)
      .setStyle(TextInputStyle.Paragraph);
    const row = new ActionRowBuilder<TextInputBuilder>().addComponents(input);
    const modal = new ModalBuilder()
      .setCustomId("answer")
      .setTitle("Answer Question")
      .addComponents(row);
    await interaction.showModal(modal);
  } catch (err) {
    await errorHandler(Melody, "question answer button", err);
    await interaction.editReply({
      content:
        "Forgive me, but I failed to complete your request. Please try again later."
    });
  }
};
