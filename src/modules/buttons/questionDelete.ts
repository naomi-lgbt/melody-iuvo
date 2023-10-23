import { ExtendedClient } from "../../interfaces/ExtendedClient";
import { GuildButton } from "../../interfaces/GuildButton";
import { errorHandler } from "../../utils/errorHandler";
import { isOwner } from "../../utils/isOwner";

/**
 * Handles when the "Delete Question" button is clicked.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @param {GuildButton} interaction The interaction payload from Discord.
 */
export const questionDelete = async (
  bot: ExtendedClient,
  interaction: GuildButton
) => {
  try {
    if (!isOwner(interaction.user.id)) {
      await interaction.reply({
        content: "Only Naomi can click these buttons.",
        ephemeral: true
      });
      return;
    }
    await interaction.deferReply({ ephemeral: true });
    const id = interaction.customId.split("-")[1];
    await interaction.message.edit({
      content: `This message has been flagged for violating our community guidelines.`,
      components: []
    });
    await interaction.editReply({
      content: `For moderation purposes, that question was asked by <@!${id}> (${id}).`
    });
  } catch (err) {
    await errorHandler(bot, "question delete button", err);
    await interaction.editReply({
      content:
        "Forgive me, but I failed to complete your request. Please try again later."
    });
  }
};
