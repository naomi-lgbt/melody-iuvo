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
    await bot.env.debugHook.send({
      content: "Bot is ready.",
      username: bot.user?.username ?? "Melody",
      avatarURL:
        bot.user?.displayAvatarURL() ??
        "https://cdn.nhcarrigan.com/avatars/nhcarrigan.png"
    });

    await bot.discord.channels.general?.send({
      content: "I am back from my nap!"
    });
    // at 7am every day
    scheduleJob("__naomiTodos", "0 7 * * *", async () => {
      const toDos = await bot.db.toDo.findMany();
      if (!toDos.length) {
        await bot.discord.channels.general?.send({
          content:
            "Good morning, Mama! You have no tasks at the moment. Please enjoy your morning while you catch up on notifications."
        });
        return;
      }
      await bot.discord.channels.general?.send({
        content:
          "Good morning, Mama! Please enjoy your morning while you catch up on notifications. When you are ready, the following tasks need your attention:\n" +
          toDos.map((t) => `- \`${t.key}\`: ${t.description}`).join("\n")
      });
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
        )}`,
        username: bot.user?.username ?? "Melody",
        avatarURL:
          bot.user?.displayAvatarURL() ??
          "https://cdn.nhcarrigan.com/avatars/nhcarrigan.png"
      });
    }
  } catch (err) {
    await errorHandler(bot, "client ready event", err);
  }
};
