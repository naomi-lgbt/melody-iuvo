import { scheduleJob } from "node-schedule";

import { ExtendedClient } from "../interfaces/ExtendedClient";
import { processGithubIssues } from "../modules/processGithubIssues";
import { scheduleBirthdayPosts } from "../modules/scheduleBirthdayPosts";
import { serve } from "../server/serve";
import { errorHandler } from "../utils/errorHandler";
import { loadGeneralChannel } from "../utils/loadGeneralChannel";
import { loadSteam } from "../utils/loadSteam";
import { mountTwitch } from "../utils/mountTwitch";
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
    await loadGeneralChannel(bot);
    await mountTwitch(bot);
    await loadSteam(bot);
    await serve(bot);
    setInterval(async () => await processGithubIssues(bot), 1000 * 60 * 60);
    await bot.env.debugHook.send("Bot is ready.");

    await bot.general.send({
      content: "I am back from my nap!"
    });
    // at 9am every day
    scheduleJob("0 9 * * *", async () => {
      await scheduleBirthdayPosts(bot);
    });
    // at noon every day
    scheduleJob("0 12 * * *", async () => {
      await bot.general.send({
        content: `Remember that you can donate to support Mama Naomi's work: <https://donate.nhcarrigan.com>`
      });
    });
  } catch (err) {
    await errorHandler(bot, "client ready event", err);
  }
};
