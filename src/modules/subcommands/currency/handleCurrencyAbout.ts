import { users } from "@prisma/client";
import { EmbedBuilder } from "discord.js";

import {
  CurrencyEmotes,
  CurrencyName,
  CurrencyValues,
} from "../../../config/Currency";
import { CommandHandler } from "../../../interfaces/CommandHandler";
import { errorHandler } from "../../../utils/errorHandler";

/**
 * Provides information about the currency system.
 */
export const handleCurrencyAbout: CommandHandler = async (bot, interaction) => {
  try {
    const totals = (
      Object.entries(CurrencyValues) as [keyof users["currency"], number][]
    ).map(
      ([currency, value]) =>
        `One ${
          CurrencyEmotes[currency]
        } is worth ${value.toLocaleString()} ${CurrencyName}.`
    );

    const embed = new EmbedBuilder();
    embed.setTitle(CurrencyName);
    embed.setDescription(
      `One of my duties is to manage the economy of our community.\n\nYou earn ${CurrencyName} slowly as you interact with your fellow members, and can be granted currency by Naomi for specific events and rewards.\n\nYou can use your currency to purchase items with the \`/currency purchase\` command. If you want to know about a specific item, you can look it up with the \`/currency item\` command. See how much you currently have with the \`/currency wallet\` command!\n\nCurrencies have no cash value.`
    );
    embed.addFields([
      {
        name: "Currency values",
        value: totals.join("\n"),
      },
    ]);
    await interaction.editReply({
      embeds: [embed],
    });
  } catch (err) {
    await errorHandler(bot, "currency about command handler", err);
  }
};
