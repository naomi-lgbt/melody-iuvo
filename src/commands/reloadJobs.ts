import { toString } from "cronstrue";
import { SlashCommandBuilder } from "discord.js";
import { scheduleJob, scheduledJobs } from "node-schedule";

import { Command } from "../interfaces/Command";
import { errorHandler } from "../utils/errorHandler";
import { isOwner } from "../utils/isOwner";

export const reloadJobs: Command = {
  data: new SlashCommandBuilder()
    .setName("reload-jobs")
    .setDescription("Reload and update all scheduled reminders.")
    .setDMPermission(false),
  run: async (Melody, interaction) => {
    try {
      await interaction.deferReply();
      if (!isOwner(interaction.member.id)) {
        await interaction.editReply({
          content: "Only Mama Naomi may manage reminders."
        });
        return;
      }
      await Melody.env.debugHook.send({
        content: "Cancelling all existing reminders.",
        username: Melody.user?.username ?? "Melody",
        avatarURL:
          Melody.user?.displayAvatarURL() ??
          "https://cdn.nhcarrigan.com/avatars/nhcarrigan.png"
      });
      const cachedJobs = [...Melody.jobs];
      Melody.jobs = [];
      for (const job of cachedJobs) {
        job.cancel();
        await Melody.env.debugHook.send({
          content: `Cancelling job ${job.name}`,
          username: Melody.user?.username ?? "Melody",
          avatarURL:
            Melody.user?.displayAvatarURL() ??
            "https://cdn.nhcarrigan.com/avatars/nhcarrigan.png"
        });
      }
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
      await interaction.editReply({
        content: `All reminder CRON jobs have been reloaded.\nCached Reminders: ${Melody.jobs
          .map((j) => j.name)
          .join(", ")}\nScheduled Jobs: ${Object.values(scheduledJobs)
          .map((j) => j.name.replace(/_/g, "\\_"))
          .join(", ")}`
      });
    } catch (err) {
      await errorHandler(Melody, "faq command", err);
      await interaction.editReply({
        content:
          "Forgive me, but I failed to complete your request. Please try again later."
      });
    }
  }
};
