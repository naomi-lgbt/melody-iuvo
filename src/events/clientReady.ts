import { ExtendedClient } from "../interfaces/ExtendedClient";
import { processGithubIssues } from "../modules/processGithubIssues";
import { errorHandler } from "../utils/errorHandler";
import { logHandler } from "../utils/logHandler";
import { registerCommands } from "../utils/registerCommands";

/**
 * Handles the ClientReady event from Discord.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 */
export const clientReady = async (bot: ExtendedClient) => {
  try {
    await registerCommands(bot);
    await processGithubIssues(bot);
    setInterval(async () => await processGithubIssues(bot), 1000 * 60 * 60);
    logHandler.log("info", "Bot is ready.");
  } catch (err) {
    await errorHandler(bot, "client ready event", err);
  }
};
