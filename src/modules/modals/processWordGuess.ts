import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalSubmitInteraction
} from "discord.js";

import { CurrencyName, CurrencyWords } from "../../config/Currency";
import { ExtendedClient } from "../../interfaces/ExtendedClient";
import { errorHandler } from "../../utils/errorHandler";
import { formatWordGuess } from "../../utils/formatWordGuess";
import { makeChange } from "../makeChange";

/**
 * Handles the logic for processing a guess for the word game.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @param {ModalSubmitInteraction} interaction The interaction payload from Discord.
 */
export const processWordGuess = async (
  bot: ExtendedClient,
  interaction: ModalSubmitInteraction
) => {
  try {
    const [, id] = interaction.customId.split("-");
    if (id !== interaction.user.id) {
      await interaction.editReply({
        content: "How did you submit a modal that isn't yours?"
      });
      return;
    }
    const guess = interaction.fields.getTextInputValue("guess");
    if (!CurrencyWords.includes(guess)) {
      await interaction.editReply({
        content: "That's not in our dictionary."
      });
      return;
    }
    const button = new ButtonBuilder()
      .setCustomId(`word-${interaction.user.id}`)
      .setStyle(ButtonStyle.Success)
      .setLabel("Guess the Word");

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
    const cache = bot.cache.wordGame[interaction.user.id];
    cache.guesses.push(formatWordGuess(guess, cache.target));
    if (guess === cache.target) {
      const newTotal = cache.balance + cache.wager * 4;
      await interaction.editReply({
        content: `You won ${
          cache.wager * 5
        } ${CurrencyName}! Your new total is ${newTotal} ${CurrencyName}.
              
\`\`\`ansi
${cache.guesses.join("\n")}
\`\`\``,
        components: []
      });
      delete bot.cache.wordGame[interaction.user.id];
      await bot.db.users.update({
        where: {
          userId: interaction.user.id
        },
        data: {
          currency: { ...makeChange(newTotal) }
        }
      });
      return;
    }
    if (cache.guesses.length >= 5) {
      await interaction.editReply({
        content: `You lost ${cache.wager} ${CurrencyName}! The word was ${
          cache.target
        }.
              
\`\`\`ansi
${cache.guesses.join("\n")}
\`\`\``,
        components: []
      });
      delete bot.cache.wordGame[interaction.user.id];
      await bot.db.users.update({
        where: {
          userId: interaction.user.id
        },
        data: {
          currency: { ...makeChange(cache.balance - cache.wager) }
        }
      });
      return;
    }

    await interaction.editReply({
      content: `Guess ${cache.guesses.length} / 5:
  
\`\`\`ansi
${cache.guesses.join("\n")}
\`\`\`
              `,
      components: [row]
    });
  } catch (err) {
    await errorHandler(bot, "process word guess", err);
    await interaction.editReply({
      content:
        "Forgive me, but I failed to complete your request. Please try again later."
    });
  }
};
