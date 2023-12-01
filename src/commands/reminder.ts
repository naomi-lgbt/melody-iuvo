import { toString } from "cronstrue";
import { SlashCommandBuilder } from "discord.js";
import { scheduleJob } from "node-schedule";

import { Command } from "../interfaces/Command";
import { errorHandler } from "../utils/errorHandler";
import { isOwner } from "../utils/isOwner";

export const reminder: Command = {
  data: new SlashCommandBuilder()
    .setName("reminder")
    .setDescription("Allows Mama Naomi to schedule a reminder for herself.")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("cron")
        .setDescription("The cron schedule for the reminder.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("title")
        .setDescription("The title for the reminder.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("The text for the reminder.")
        .setRequired(true)
    ),
  run: async (bot, interaction) => {
    try {
      await interaction.deferReply();
      if (!isOwner(interaction.member.id)) {
        await interaction.editReply({
          content: "Only Mama Naomi may schedule reminders."
        });
        return;
      }
      const cron = interaction.options.getString("cron", true);
      const title = interaction.options.getString("title", true);
      const text = interaction.options.getString("text", true);

      const cronString = toString(cron);

      const reminder = await bot.db.reminder.create({
        data: {
          cron,
          title,
          text
        }
      });

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

      await interaction.editReply({
        content: `Your ${title} job has been scheduled for ${cronString}`
      });
    } catch (err) {
      await errorHandler(bot, "reminder command", err);
    }
  }
};
