import {
  CurrencyName,
  CurrencySlots,
  CurrencySlotReel
} from "../../../config/Currency";
import { CommandHandler } from "../../../interfaces/CommandHandler";
import { errorHandler } from "../../../utils/errorHandler";
import { getDatabaseRecord } from "../../../utils/getDatabaseRecord";
import { getRandomValue } from "../../../utils/getRandomValue";
import { sleep } from "../../../utils/sleep";
import { makeChange } from "../../makeChange";
import { sumCurrency } from "../../sumCurrency";

const calculateWinRate = (setSize: number) => {
  switch (setSize) {
    case 5:
      return 0;
    case 4:
      return 1;
    case 3:
      return CurrencySlots.length;
    case 2:
      return Math.round(CurrencySlots.length * 10);
    case 1:
      return Math.round(CurrencySlots.length * 25);
    default:
      return 1;
  }
};

/**
 * Allows members to play a slot machine game.
 */
export const handleCurrencySlots: CommandHandler = async (bot, interaction) => {
  try {
    if (bot.cache.wordGame[interaction.user.id]) {
      await interaction.editReply({
        content:
          "It would seem you are still playing a word game. Please complete that first, before playing slots."
      });
      return;
    }
    // played less than 5 minutes ago
    if (
      bot.cache.slots[interaction.user.id] &&
      Date.now() - bot.cache.slots[interaction.user.id].lastPlayed < 300000
    ) {
      await interaction.editReply({
        content:
          "My oh my, it would seem you've become addicted to our slot machines. Give yourself a moment to breathe, and come play again in a few minutes."
      });
      return;
    }
    bot.cache.slots[interaction.user.id] = {
      lastPlayed: Date.now()
    };

    const wager = interaction.options.getInteger("wager", true);
    const userRecord = await getDatabaseRecord(bot, interaction.user.id);
    if (!userRecord) {
      await interaction.editReply({
        content: "I beg your pardon, but I seem to have misplaced your records."
      });
      return;
    }
    const oldTotal = sumCurrency(userRecord.currency);
    if (wager > oldTotal) {
      await interaction.editReply({
        content: `It would seem you do not have that much to wager.`
      });
      return;
    }
    const totalWithoutWager = oldTotal - wager;
    const first = getRandomValue(CurrencySlots);
    const second = getRandomValue(CurrencySlots);
    const third = getRandomValue(CurrencySlots);
    const fourth = getRandomValue(CurrencySlots);
    const fifth = getRandomValue(CurrencySlots);
    const set = new Set([first, second, third, fourth, fifth]);
    const won = set.size < 5;

    const result = Math.round(wager * calculateWinRate(set.size));
    await interaction.editReply({
      content: `Spinning...\n# ${CurrencySlotReel} ${CurrencySlotReel} ${CurrencySlotReel} ${CurrencySlotReel} ${CurrencySlotReel}`
    });
    await sleep(1000);
    await interaction.editReply({
      content: `Spinning...\n# ${first} ${CurrencySlotReel} ${CurrencySlotReel} ${CurrencySlotReel} ${CurrencySlotReel}`
    });
    await sleep(1000);
    await interaction.editReply({
      content: `Spinning...\n# ${first} ${second} ${CurrencySlotReel} ${CurrencySlotReel} ${CurrencySlotReel}`
    });
    await sleep(1000);
    await interaction.editReply({
      content: `Spinning...\n# ${first} ${second} ${third} ${CurrencySlotReel} ${CurrencySlotReel}`
    });
    await sleep(1000);
    await interaction.editReply({
      content: `Spinning...\n# ${first} ${second} ${third} ${fourth} ${CurrencySlotReel}`
    });
    await sleep(1000);
    await interaction.editReply({
      content: `Spinning...\n# ${first} ${second} ${third} ${fourth} ${fifth}`
    });
    const newTotal = totalWithoutWager + result;
    await bot.db.users.update({
      where: {
        userId: interaction.user.id
      },
      data: {
        currency: { ...makeChange(newTotal) }
      }
    });
    await interaction.editReply({
      content: `You ${
        won
          ? `won ${result.toLocaleString()}`
          : `lost ${wager.toLocaleString()}`
      } ${CurrencyName}!\n# ${first} ${second} ${third} ${fourth} ${fifth}\nYou now have ${newTotal.toLocaleString()} ${CurrencyName}.`
    });
  } catch (err) {
    await errorHandler(bot, "currency slots command", err);
    await interaction.editReply({
      content:
        "Forgive me, but I failed to complete your request. Please try again later."
    });
  }
};
