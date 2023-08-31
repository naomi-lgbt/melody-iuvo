import { CurrencyDailyEvents, CurrencyName } from "../../../config/Currency";
import { CommandHandler } from "../../../interfaces/CommandHandler";
import { errorHandler } from "../../../utils/errorHandler";
import { getDatabaseRecord } from "../../../utils/getDatabaseRecord";
import { getRandomValue } from "../../../utils/getRandomValue";
import { getDailyEventChange } from "../../getDailyEventChange";
import { makeChange } from "../../makeChange";
import { sumCurrency } from "../../sumCurrency";

/**
 * Handles the logic for the daily currency reward.
 */
export const handleCurrencyDaily: CommandHandler = async (bot, interaction) => {
  try {
    if (bot.cache.wordGame[interaction.user.id]) {
      await interaction.editReply({
        content:
          "It would seem you are still playing a word game. Please complete that first, before doing your daily event.",
      });
      return;
    }
    const record = await getDatabaseRecord(bot, interaction.user.id);
    if (!record) {
      await interaction.editReply({
        content:
          "I beg your pardon, but I seem to have misplaced your records.",
      });
      return;
    }
    // If currencyDaily is less than 24 hours ago.
    if (
      record.currencyDaily &&
      record.currencyDaily > new Date(Date.now() - 86400000)
    ) {
      await interaction.editReply({
        content:
          "It would seem you have already done your daily event. Please try again later.",
      });
      return;
    }
    const event = getRandomValue(CurrencyDailyEvents);
    const change = getDailyEventChange(event);
    const oldTotal = sumCurrency(record.currency);
    const newTotal = event.loss ? oldTotal - change : oldTotal + change;
    const newCurrency = makeChange(newTotal >= 0 ? newTotal : 0);
    await bot.db.users.update({
      where: {
        userId: interaction.user.id,
      },
      data: {
        currencyDaily: new Date(),
        currency: newCurrency,
      },
    });
    await interaction.editReply({
      content: `# ${event.title}\n${event.description}\nYou ${
        event.loss ? "lost" : "gained"
      } ${change} ${CurrencyName}.`,
    });
  } catch (err) {
    await errorHandler(bot, "handleCurrencyDaily", err);
    await interaction.editReply({
      content:
        "Forgive me, but I failed to complete your request. Please try again later.",
    });
  }
};
