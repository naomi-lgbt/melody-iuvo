import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";

import { Command } from "../interfaces/Command";
import { errorHandler } from "../utils/errorHandler";
import { isOwner } from "../utils/isOwner";

export const todo: Command = {
  data: new SlashCommandBuilder()
    .setName("todo")
    .setDescription("For Naomi to manage her to-dos.")
    .setDMPermission(false)
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("create")
        .setDescription("Create a new task.")
        .addStringOption((option) =>
          option
            .setName("key")
            .setDescription("The unique key to assign the task.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("description")
            .setDescription("Brief explanation of the text.")
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("complete")
        .setDescription("Complete a task.")
        .addStringOption((option) =>
          option
            .setName("key")
            .setDescription("The unique key assigned the task.")
            .setRequired(true)
        )
    ),
  run: async (bot, interaction) => {
    try {
      await interaction.deferReply();
      if (!isOwner(interaction.member.id)) {
        await interaction.editReply({
          content: "Only Mama Naomi may manage tasks."
        });
        return;
      }
      const subCommand = interaction.options.getSubcommand();
      const key = interaction.options.getString("key", true);

      if (subCommand === "complete") {
        const exists = await bot.db.toDo.findUnique({ where: { key } });
        if (!exists) {
          await interaction.editReply({
            content: `Could not find a to-do with ${key}`
          });
          return;
        }
        await bot.db.toDo.delete({
          where: {
            key
          }
        });
        await interaction.editReply({
          content: `I have marked ${key} as complete.`
        });
        return;
      }

      if (subCommand === "create") {
        const description = interaction.options.getString("description", true);
        const exists = await bot.db.toDo.findUnique({ where: { key } });
        if (exists) {
          await interaction.editReply({
            content: `A to-do with ${key} already exists.`
          });
          return;
        }
        await bot.db.toDo.create({
          data: {
            key,
            description
          }
        });
        await interaction.editReply({
          content: `I have created the ${key} to-do for you.`
        });
        return;
      }
    } catch (err) {
      await errorHandler(bot, "todo command", err);
    }
  }
};
