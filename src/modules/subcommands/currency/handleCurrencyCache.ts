import { CommandHandler } from "../../../interfaces/CommandHandler";
import { ExtendedClient } from "../../../interfaces/ExtendedClient";
import { errorHandler } from "../../../utils/errorHandler";
import { isOwner } from "../../../utils/isOwner";

/**
 * Removes a cached cooldown from a user.
 */
export const handleCurrencyCache: CommandHandler = async (bot, interaction) => {
  try {
    if (!isOwner(interaction.user.id)) {
      await interaction.editReply({
        content: "Only Mama Naomi may use this command.",
      });
      return;
    }
    const target = interaction.options.getUser("target", true);
    const prop = interaction.options.getString(
      "prop",
      true
    ) as keyof ExtendedClient["cache"];
    delete bot.cache[prop][target.id];
    await interaction.editReply({
      content: `Cleared ${target.username}'s ${prop} cache!`,
    });
  } catch (err) {
    await errorHandler(bot, "currency cache command", err);
    await interaction.editReply({
      content:
        "Forgive me, but I failed to complete your request. Please try again later.",
    });
  }
};
