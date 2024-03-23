import { toString } from "cronstrue";
import { scheduleJob } from "node-schedule";

import { ExtendedClient } from "../interfaces/ExtendedClient";
import { awakenMember } from "../modules/awakenMember";
import { processGithubIssues } from "../modules/processGithubIssues";
import { scheduleBirthdayPosts } from "../modules/scheduleBirthdayPosts";
import { serve } from "../server/serve";
import { errorHandler } from "../utils/errorHandler";
import { loadDiscordCache } from "../utils/loadDiscordCache";
import { registerCommands } from "../utils/registerCommands";

/**
 * Handles the ClientReady event from Discord.
 *
 * @param {ExtendedClient} Melody The Melody's Discord instance.
 */
export const clientReady = async (Melody: ExtendedClient) => {
  try {
    await registerCommands(Melody);
    await loadDiscordCache(Melody);
    await processGithubIssues(Melody);
    await serve(Melody);
    setInterval(async () => await processGithubIssues(Melody), 1000 * 60 * 60);
    await Melody.env.debugHook.send({
      content: "Melody is ready.",
      username: Melody.user?.username ?? "Melody",
      avatarURL:
        Melody.user?.displayAvatarURL() ??
        "https://cdn.nhcarrigan.com/avatars/nhcarrigan.png"
    });

    await Melody.discord.channels.general?.send({
      content: "I am back from my nap!"
    });
    // at 7am every day
    scheduleJob("__naomiToDos", "0 7 * * *", async () => {
      const toDos = await Melody.db.toDo.findMany();
      if (!toDos.length) {
        await Melody.discord.channels.general?.send({
          content:
            "Good morning, Mama! You have no tasks at the moment. Please enjoy your morning while you catch up on notifications."
        });
        return;
      }
      await Melody.discord.channels.general?.send({
        content:
          "Good morning, Mama! Please enjoy your morning while you catch up on notifications. When you are ready, the following tasks need your attention:\n" +
          toDos.map((t) => `- \`${t.key}\`: ${t.description}`).join("\n")
      });
    });
    // at 9am every day
    scheduleJob("__birthdaysToday", "0 9 * * *", async () => {
      await scheduleBirthdayPosts(Melody);
    });
    // at midnight every day
    scheduleJob("__resetBeaned", "0 0 * * * ", () => {
      Melody.beanedUser = null;
    });
    scheduleJob("__awakening", "0 0 * * *", async () => {
      await awakenMember(Melody);
    });

    const reminders = await Melody.db.reminder.findMany();
    for (const reminder of reminders) {
      const job = scheduleJob(reminder.title, reminder.cron, async () => {
        await Melody.discord.channels.general?.send({
          content: `## ${reminder.title}\n<@!${reminder.userId}>, ${reminder.text}`
        });
      });
      Melody.jobs.push(job);
      await Melody.env.debugHook.send({
        content: `Reminder ${reminder.title} scheduled for ${toString(
          reminder.cron
        )}`,
        username: Melody.user?.username ?? "Melody",
        avatarURL:
          Melody.user?.displayAvatarURL() ??
          "https://cdn.nhcarrigan.com/avatars/nhcarrigan.png"
      });
    }
  } catch (err) {
    await errorHandler(Melody, "client ready event", err);
  }
};
