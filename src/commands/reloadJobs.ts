import { toString } from "cronstrue";
import { SlashCommandBuilder } from "discord.js";
import { scheduleJob } from "node-schedule";

import { Command } from "../interfaces/Command";
import { errorHandler } from "../utils/errorHandler";
import { isOwner } from "../utils/isOwner";

export const reloadJobs: Command = {
  data: new SlashCommandBuilder()
    .setName("reload-jobs")
    .setDescription("Reload and update all scheduled reminders.")
    .setDMPermission(false),
  run: async (bot, interaction) => {
    try {
      await interaction.deferReply();
      if (!isOwner(interaction.member.id)) {
        await interaction.editReply({
          content: "Only Mama Naomi may manage reminders."
        });
        return;
      }
      await bot.env.debugHook.send({
        content: "Cancelling all existing reminders."
      });
      for (const job of bot.jobs) {
        job.cancel();
      }
      bot.jobs = [];
      const reminders = await bot.db.reminder.findMany();
      for (const reminder of reminders) {
        const job = scheduleJob(reminder.cron, async () => {
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
      await interaction.editReply({
        content: "All reminder CRON jobs have been reloaded."
      });
    } catch (err) {
      await errorHandler(bot, "faq command", err);
      await interaction.editReply({
        content:
          "Forgive me, but I failed to complete your request. Please try again later."
      });
    }
  }
};
