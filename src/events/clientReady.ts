import { toString } from "cronstrue";
import { scheduleJob } from "node-schedule";

import { ExtendedClient } from "../interfaces/ExtendedClient";
import { processGithubIssues } from "../modules/processGithubIssues";
import { scheduleBirthdayPosts } from "../modules/scheduleBirthdayPosts";
import { serve } from "../server/serve";
import { errorHandler } from "../utils/errorHandler";
import { loadDiscordCache } from "../utils/loadDiscordCache";
import { loadSteam } from "../utils/loadSteam";
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
    await loadSteam(bot);
    await serve(bot);
    setInterval(async () => await processGithubIssues(bot), 1000 * 60 * 60);
    await bot.env.debugHook.send("Bot is ready.");

    await bot.discord.channels.general?.send({
      content: "I am back from my nap!"
    });
    // at 9am every day
    scheduleJob("__birthdaysToday", "0 9 * * *", async () => {
      await scheduleBirthdayPosts(bot);
    });
    // at midnight every day
    scheduleJob("__resetBeaned", "0 0 * * * ", () => {
      bot.beanedUser = null;
    });

    const reminders = await bot.db.reminder.findMany();
    for (const reminder of reminders) {
      const job = scheduleJob(reminder.title, reminder.cron, async () => {
        await bot.discord.channels.general?.send({
          content: `## ${reminder.title}\n<@!${reminder.userId}>, ${reminder.text}`
        });
      });
      bot.jobs.push(job);
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
