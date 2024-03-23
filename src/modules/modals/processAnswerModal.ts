import { ModalSubmitInteraction } from "discord.js";

import { ExtendedClient } from "../../interfaces/ExtendedClient";
import { errorHandler } from "../../utils/errorHandler";

/**
 * Handles the logic for the answer modal.
 *
 * @param {ExtendedClient} Melody The Melody's Discord instance.
 * @param {ModalSubmitInteraction} interaction The interaction payload from Discord.
 */
export const processAnswerModal = async (
  Melody: ExtendedClient,
  interaction: ModalSubmitInteraction
) => {
  try {
    await interaction.deferReply({
      ephemeral: true
    });
    if (!interaction.message) {
      await interaction.editReply({
        content: "Something went wrong. Please try again."
      });
      return;
    }
    const answer = interaction.fields.getTextInputValue("answer");
    await interaction.message.edit({
      content: `**${interaction.message.content
        .split("\n")
        .slice(-1)}**\n\n${answer}`,
      components: []
    });
    await interaction.editReply({
      content: "Your answer has been submitted."
    });
  } catch (err) {
    await errorHandler(Melody, "process answer modal", err);
    await interaction.editReply({
      content:
        "Forgive me, but I failed to complete your request. Please try again later."
    });
  }
};
