import { EmbedBuilder } from "discord.js";

import { CurrencyName } from "../../../config/Currency";
import { CommandHandler } from "../../../interfaces/CommandHandler";
import { errorHandler } from "../../../utils/errorHandler";
import { getDatabaseRecord } from "../../../utils/getDatabaseRecord";
import { parseCurrencyString } from "../../parseCurrencyString";
import { sumCurrency } from "../../sumCurrency";

/**
 * Displays a member's balance.
 */
export const handleCurrencyWallet: CommandHandler = async (
  bot,
  interaction
) => {
  try {
    const userRecord = await getDatabaseRecord(bot, interaction.user.id);
    if (!userRecord) {
      await interaction.editReply({
        content: "I beg your pardon, but I seem to have misplaced your records."
      });
      return;
    }
    const embed = new EmbedBuilder();
    embed.setTitle(`Your ${CurrencyName}`);
    embed.setDescription(parseCurrencyString(userRecord.currency));
    embed.addFields([
      {
        name: "Total",
        value: sumCurrency(userRecord.currency).toLocaleString()
      }
    ]);
    await interaction.editReply({
      embeds: [embed]
    });
  } catch (err) {
    await errorHandler(bot, "currency wallet command", err);
    await interaction.editReply({
      content:
        "Forgive me, but I failed to complete your request. Please try again later."
    });
  }
};
