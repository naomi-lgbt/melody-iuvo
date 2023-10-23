import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

import { CurrencyWords } from "../../../config/Currency";
import { CommandHandler } from "../../../interfaces/CommandHandler";
import { errorHandler } from "../../../utils/errorHandler";
import { getDatabaseRecord } from "../../../utils/getDatabaseRecord";
import { getRandomValue } from "../../../utils/getRandomValue";
import { sumCurrency } from "../../sumCurrency";

/**
 * Starts a word game.
 */
export const handleCurrencyWord: CommandHandler = async (bot, interaction) => {
  try {
    const wager = interaction.options.getInteger("wager", true);
    const userRecord = await getDatabaseRecord(bot, interaction.user.id);
    if (!userRecord) {
      await interaction.editReply({
        content: "I beg your pardon, but I seem to have misplaced your records."
      });
      return;
    }
    const oldTotal = sumCurrency(userRecord.currency);
    if (oldTotal < wager) {
      await interaction.editReply({
        content: "It would seem you do not have that much to wager."
      });
      return;
    }

    const targetWord = getRandomValue(CurrencyWords);
    if (bot.cache.wordGame[interaction.user.id]) {
      await interaction.editReply({
        content: "It would seem you are already playing one of these."
      });
      return;
    }
    bot.cache.wordGame[interaction.user.id] = {
      wager,
      target: targetWord,
      guesses: [],
      balance: oldTotal
    };

    const button = new ButtonBuilder()
      .setCustomId(`word-${interaction.user.id}`)
      .setStyle(ButtonStyle.Success)
      .setLabel("Guess the Word");

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
    await interaction.editReply({
      content:
        "You have five guesses to guess this 5-letter word. Letters will be yellow if they are in the word, but not in the correct position. Letters will be green if they are in the correct position. Good luck~!",
      components: [row]
    });
  } catch (err) {
    await errorHandler(bot, "word command", err);
    await interaction.editReply({
      content:
        "Forgive me, but I failed to complete your request. Please try again later."
    });
  }
};
