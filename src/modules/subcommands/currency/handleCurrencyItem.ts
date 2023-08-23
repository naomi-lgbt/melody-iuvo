import { EmbedBuilder } from "discord.js";

import { CurrencyItems, CurrencyName } from "../../../config/Currency";
import { CommandHandler } from "../../../interfaces/CommandHandler";
import { errorHandler } from "../../../utils/errorHandler";
import { makeChange } from "../../makeChange";
import { parseCurrencyString } from "../../parseCurrencyString";

/**
 * Displays information about an item.
 */
export const handleCurrencyItem: CommandHandler = async (bot, interaction) => {
  try {
    const id = interaction.options.getString("target", true);
    const item = CurrencyItems.find((i) => i.internalId === id);
    if (!item) {
      await interaction.editReply({
        content: "That item doesn't exist!",
      });
      return;
    }
    const embed = new EmbedBuilder();
    embed.setTitle(item.name);
    embed.setDescription(item.description);
    embed.addFields([
      {
        name: `${item.price.toLocaleString()} ${CurrencyName}`,
        value: parseCurrencyString(makeChange(item.price)),
      },
    ]);
    await interaction.editReply({
      embeds: [embed],
    });
  } catch (err) {
    await errorHandler(bot, "currency item command", err);
  }
};
