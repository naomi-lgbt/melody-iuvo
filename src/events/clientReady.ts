import { toString } from "cronstrue";
import { scheduleJob } from "node-schedule";

import { ExtendedClient } from "../interfaces/ExtendedClient";
import { announceCovenStats } from "../modules/announceCovenStats";
import { getSpotifySong } from "../modules/getSpotifySong";
import { postQuestion } from "../modules/postQuestion";
import { processGithubIssues } from "../modules/processGithubIssues";
import { scheduleBirthdayPosts } from "../modules/scheduleBirthdayPosts";
import { serve } from "../server/serve";
import { errorHandler } from "../utils/errorHandler";
import { loadDiscordCache } from "../utils/loadDiscordCache";
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
    await loadDiscordCache(bot);
    await processGithubIssues(bot);
    await mountTwitch(bot);
    await loadSteam(bot);
    await serve(bot);
    setInterval(async () => await processGithubIssues(bot), 1000 * 60 * 60);
    await bot.env.debugHook.send("Bot is ready.");

    await bot.discord.channels.general?.send({
      content: "I am back from my nap!"
    });
    // at 7am every day
    scheduleJob("0 7 * * *", async () => {
      await getSpotifySong(bot);
    });
    // at 8am every day
    scheduleJob("0 8 * * *", async () => {
      await announceCovenStats(bot);
    });
    // at 9am every day
    scheduleJob("0 9 * * *", async () => {
      await scheduleBirthdayPosts(bot);
    });
    // at 11am every day
    scheduleJob("0 11 * * *", async () => {
      await postQuestion(bot);
    });
    // at noon every day
    scheduleJob("0 12 * * *", async () => {
      await bot.discord.channels.general?.send({
        content: `Remember that you can donate to support Mama Naomi's work: <https://donate.nhcarrigan.com>`
      });
    });
    // at midnight every day
    scheduleJob("0 0 * * * ", () => {
      bot.beanedUser = null;
    });

    const reminders = await bot.db.reminder.findMany();
    for (const reminder of reminders) {
      scheduleJob(reminder.cron, async () => {
        await bot.discord.channels.general?.send({
          content: `## ${reminder.title}\n<@!465650873650118659>, ${reminder.text}`
        });
      });
      await bot.env.debugHook.send({
        content: `Reminder ${reminder.title} scheduled for ${toString(
          reminder.cron
        )}`
      });
    }
  } catch (err) {
    await errorHandler(bot, "client ready event", err);
  }
};
