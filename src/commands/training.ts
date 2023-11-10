import { SlashCommandBuilder } from "discord.js";

import {
  FocusChoices,
  FocusRoles,
  MagicChoices,
  MagicRoles,
  PurposeChoices,
  PurposeRoles
} from "../config/Training";
import { Command } from "../interfaces/Command";
import { errorHandler } from "../utils/errorHandler";

export const training: Command = {
  data: new SlashCommandBuilder()
    .setName("training")
    .setDescription("Complete your coven initiation training.")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("virtue")
        .setDescription("Which virtue is most important to you?")
        .setRequired(true)
        .addChoices(
          ...Object.entries(FocusChoices).map(([value, name]) => ({
            name,
            value
          }))
        )
    )
    .addStringOption((option) =>
      option
        .setName("magic")
        .setDescription("How do you wish to use your magical abilities?")
        .setRequired(true)
        .addChoices(
          ...Object.entries(MagicChoices).map(([value, name]) => ({
            name,
            value
          }))
        )
    )
    .addStringOption((option) =>
      option
        .setName("role")
        .setDescription("Which role do you wish to fulfil in our coven?")
        .setRequired(true)
        .addChoices(
          ...Object.entries(PurposeChoices).map(([value, name]) => ({
            name,
            value
          }))
        )
    ),
  run: async (bot, interaction) => {
    try {
      await interaction.deferReply({ ephemeral: true });
      if (!bot.discord.roles.regular) {
        await interaction.editReply({
          content: "I cannot find the coven role. Please contact Naomi."
        });
        return;
      }
      const { member: rawMember } = interaction;
      const member = await rawMember.fetch();
      const isInCoven = member.roles.cache.has(bot.discord.roles.regular.id);
      if (!isInCoven) {
        await interaction.editReply({
          content:
            "You must be initiated into the coven before you are able to undergo training. Ask your fellow coven members about initiation."
        });
        return;
      }
      const hasTrained =
        member.roles.cache.has(MagicRoles.light) ||
        member.roles.cache.has(MagicRoles.dark);
      if (hasTrained) {
        await interaction.editReply({
          content: "You have already completed your training."
        });
        return;
      }

      const focus = interaction.options.getString("virtue", true);
      const magic = interaction.options.getString("magic", true);
      const purpose = interaction.options.getString("role", true);

      if (
        !(focus in FocusRoles) ||
        !(magic in MagicRoles) ||
        !(purpose in PurposeRoles)
      ) {
        await interaction.editReply({
          content:
            "Something has gone terribly awry with your training. Please reach out to Naomi."
        });
        await bot.env.debugHook.send(
          `Attempted to do training, but one of these values is incorrect: ${focus}, ${magic}, ${purpose}`
        );
        return;
      }

      await member.roles.add([
        FocusRoles[focus as keyof typeof FocusRoles],
        MagicRoles[magic as keyof typeof MagicRoles],
        PurposeRoles[purpose as keyof typeof PurposeRoles]
      ]);

      await interaction.editReply({
        content: `Congratulations. Your training is complete, and you are now one of our ${focus} ${magic} magic ${purpose}s!`
      });
    } catch (err) {
      await errorHandler(bot, "training command", err);
      await interaction.editReply(
        "Forgive me, but I failed to complete your request. Please try again later."
      );
    }
  }
};
