import { ButtonHandler } from "../../interfaces/ButtonHandler";
import { errorHandler } from "../../utils/errorHandler";

/**
 * Adds or removes the relevant role when a user clicks a button.
 */
export const processRoleButton: ButtonHandler = async (bot, interaction) => {
  try {
    await interaction.deferReply({ ephemeral: true });
    const id = interaction.customId.split("-")[1];
    if (!id) {
      await interaction.editReply({
        content: "That button doesn't have a role id. So sorry."
      });
      return;
    }
    const { member } = interaction;
    if (member.roles.cache.has(id)) {
      await member.roles.remove(id);
      await interaction.editReply({
        content: `Okay, I'll hold on to the <@&${id}> role for you.`
      });
      return;
    }
    await member.roles.add(id);
    await interaction.editReply({
      content: `Okay, I've given you the <@&${id}> role.`
    });
  } catch (err) {
    await errorHandler(bot, "process role button", err);
    await interaction.editReply({
      content: "Forgive me, but I have failed to do that."
    });
  }
};
