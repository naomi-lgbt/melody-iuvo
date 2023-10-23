import { Context } from "../interfaces/Context";
import { errorHandler } from "../utils/errorHandler";
import { isOwner } from "../utils/isOwner";

export const snippet: Context = {
  data: {
    name: "snippet",
    type: 3,
  },
  run: async (bot, interaction) => {
    try {
      await interaction.deferReply({ ephemeral: true });
      if (!isOwner(interaction.user.id)) {
        await interaction.editReply({
          content: "Only Mama may use this command.",
        });
        return;
      }
      await interaction.editReply({ content: "Hi Mama!" });
    } catch (err) {
      await errorHandler(bot, "snippet context", err);
    }
  },
};
