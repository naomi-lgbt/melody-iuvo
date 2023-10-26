import { Questions } from "../config/Questions";
import { ExtendedClient } from "../interfaces/ExtendedClient";
import { getRandomValue } from "../utils/getRandomValue";

/**
 * Posts a random question to the bot's general channel.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 */
export const postQuestion = async (bot: ExtendedClient) => {
  const question = getRandomValue(Questions);

  await bot.general.send({
    content: `# ${question}\n<@&1167154309503398018>`
  });
};
