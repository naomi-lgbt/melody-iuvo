import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

import { CommandHandler } from "../../interfaces/CommandHandler";
import { errorHandler } from "../../utils/errorHandler";

/**
 * Handles the command to ask Naomi a question.
 */
export const handleNaomiAsk: CommandHandler = async (bot, interaction) => {
  try {
    const input = new TextInputBuilder()
      .setCustomId("question")
      .setLabel("What's your question?")
      .setMaxLength(2000)
      .setRequired(true)
      .setStyle(TextInputStyle.Paragraph);
    const row = new ActionRowBuilder<TextInputBuilder>().addComponents(input);
    const modal = new ModalBuilder()
      .setCustomId("ask")
      .setTitle("Ask Naomi")
      .addComponents(row);
    await interaction.showModal(modal);
  } catch (err) {
    await errorHandler(bot, "naomi ask command", err);
    await interaction.editReply({
      content:
        "Forgive me, but I failed to complete your request. Please try again later.",
    });
  }
};
