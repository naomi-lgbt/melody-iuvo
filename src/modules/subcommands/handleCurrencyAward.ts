import { CurrencyName } from "../../config/Currency";
import { CommandHandler } from "../../interfaces/CommandHandler";
import { errorHandler } from "../../utils/errorHandler";
import { getDatabaseRecord } from "../../utils/getDatabaseRecord";
import { isOwner } from "../../utils/isOwner";
import { makeChange } from "../makeChange";
import { sumCurrency } from "../sumCurrency";

/**
 * Allows the bot owner to award currency to a user.
 */
export const handleCurrencyAward: CommandHandler = async (bot, interaction) => {
  try {
    if (!isOwner(interaction.user.id)) {
      await interaction.editReply({
        content: "Only my Mistress may use this command.",
      });
      return;
    }
    const target = interaction.options.getUser("target", true);
    if (bot.cache.wordGame[target.id]) {
      await interaction.editReply({
        content:
          "It would seem they are currently in the middle of a game. Best not to disturb them, Mistress.",
      });
      return;
    }
    const amount = interaction.options.getNumber("amount", true);
    const userRecord = await getDatabaseRecord(bot, target.id);
    if (!userRecord) {
      await interaction.editReply({
        content: "Please forgive me, Mistress. I cannot find their records.",
      });
      return;
    }
    const oldTotal = sumCurrency(userRecord.currency);
    if (amount < 0 && oldTotal < Math.abs(amount)) {
      await interaction.editReply({
        content: `You can't take away more ${CurrencyName} than the user has!`,
      });
      return;
    }
    const newTotal = oldTotal + amount;
    await bot.db.users.update({
      where: {
        userId: target.id,
      },
      data: {
        currency: { ...makeChange(newTotal) },
      },
    });
    await interaction.editReply({
      content: `You have awarded ${amount.toLocaleString()} ${CurrencyName} to <@${
        target.id
      }>! Their new total is ${newTotal.toLocaleString()} ${CurrencyName}.`,
    });
  } catch (err) {
    await errorHandler(bot, "currency award command", err);
  }
};
