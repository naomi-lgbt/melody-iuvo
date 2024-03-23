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
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("list")
        .setDescription("List all of the tasks.")
    ),
  run: async (Melody, interaction) => {
    try {
      await interaction.deferReply();
      if (!isOwner(interaction.member.id)) {
        await interaction.editReply({
          content: "Only Mama Naomi may manage tasks."
        });
        return;
      }
      const subCommand = interaction.options.getSubcommand();

      if (subCommand === "list") {
        const toDos = await Melody.db.toDo.findMany();
        if (!toDos.length) {
          await interaction.editReply({
            content: "Hi Mama! You have no tasks at the moment."
          });
          return;
        }
        await interaction.editReply({
          content:
            " When you are ready, the following tasks need your attention:\n" +
            toDos
              .map(
                (t: { key: string; description: string }) =>
                  `- \`${t.key}\`: ${t.description}`
              )
              .join("\n")
        });
        return;
      }
      const key = interaction.options.getString("key", true);

      if (subCommand === "complete") {
        const exists = await Melody.db.toDo.findUnique({ where: { key } });
        if (!exists) {
          await interaction.editReply({
            content: `Could not find a to-do with ${key}`
          });
          return;
        }
        await Melody.db.toDo.delete({
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
        const exists = await Melody.db.toDo.findUnique({ where: { key } });
        if (exists) {
          await interaction.editReply({
            content: `A to-do with ${key} already exists.`
          });
          return;
        }
        await Melody.db.toDo.create({
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
      await errorHandler(Melody, "todo command", err);
    }
  }
};
