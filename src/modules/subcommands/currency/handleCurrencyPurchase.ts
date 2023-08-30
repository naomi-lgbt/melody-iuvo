import { CurrencyItems, CurrencyName } from "../../../config/Currency";
import { CommandHandler } from "../../../interfaces/CommandHandler";
import { errorHandler } from "../../../utils/errorHandler";
import { getDatabaseRecord } from "../../../utils/getDatabaseRecord";
import { makeChange } from "../../makeChange";
import { sumCurrency } from "../../sumCurrency";

/**
 * Allows users to purchase items.
 */
export const handleCurrencyPurchase: CommandHandler = async (
  bot,
  interaction
) => {
  try {
    if (bot.cache.wordGame[interaction.user.id]) {
      await interaction.editReply({
        content:
          "It would seem you are still playing a word game. Please complete that first, before making any purchases.",
      });
      return;
    }
    const id = interaction.options.getString("target", true);
    const item = CurrencyItems.find((i) => i.internalId === id);
    if (!item) {
      await interaction.editReply({
        content: "Forgive me, but I was unable to locate that item.",
      });
      return;
    }
    const userRecord = await getDatabaseRecord(bot, interaction.user.id);
    if (!userRecord) {
      await interaction.editReply({
        content:
          "I beg your pardon, but I seem to have misplaced your records.",
      });
      return;
    }
    const oldTotal = sumCurrency(userRecord.currency);
    if (oldTotal < item.price) {
      await interaction.editReply({
        content: `It would seem you don't have enough ${CurrencyName} to purchase a **${
          item.name
        }**!\nYou have ${oldTotal.toLocaleString()} ${CurrencyName}, and need ${item.price.toLocaleString()}.`,
      });
      return;
    }
    const newTotal = oldTotal - item.price;
    await bot.db.users.update({
      where: {
        userId: interaction.user.id,
      },
      data: {
        currency: { ...makeChange(newTotal) },
      },
    });

    await interaction.editReply({
      content: `It is my pleasure to present you with a **${
        item.name
      }**!\nYou now have ${newTotal.toLocaleString()} ${CurrencyName}.`,
    });
    await interaction.channel?.send({
      content: `Mistress, ${interaction.user.username} has purchased ${item.name}!`,
    });
  } catch (err) {
    await errorHandler(bot, "currency purchase command", err);
    await interaction.editReply({
      content:
        "Forgive me, but I failed to complete your request. Please try again later.",
    });
  }
};
