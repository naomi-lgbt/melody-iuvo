import { Questions } from "../config/Questions";
import { ExtendedClient } from "../interfaces/ExtendedClient";
import { errorHandler } from "../utils/errorHandler";
import { getRandomValue } from "../utils/getRandomValue";

/**
 * Posts a random question to the bot's general channel.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 */
export const postQuestion = async (bot: ExtendedClient) => {
  try {
    const question = getRandomValue(Questions);

    await bot.discord.channels.general.send({
      content: `# ${question}\n<@&1167154309503398018>`
    });
  } catch (err) {
    await errorHandler(bot, "post question module", err);
  }
};
