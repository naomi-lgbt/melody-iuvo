import {
  ActionRowBuilder,
  ComponentType,
  Message,
  StringSelectMenuBuilder
} from "discord.js";

import { Snippets } from "../config/Snippets";
import { Context } from "../interfaces/Context";
import { errorHandler } from "../utils/errorHandler";
import { isOwner } from "../utils/isOwner";

export const snippet: Context = {
  data: {
    name: "snippet",
    type: 3
  },
  run: async (bot, interaction) => {
    try {
      await interaction.deferReply({ ephemeral: true });
      if (!isOwner(interaction.user.id)) {
        await interaction.editReply({
          content: "Only Mama may use this command."
        });
        return;
      }
      const message = interaction.options.getMessage(
        "message",
        true
      ) as Message;

      const dropdown = new StringSelectMenuBuilder()
        .setCustomId("snippets")
        .addOptions(
          ...Snippets.map(({ name }) => ({
            label: name,
            value: name
          }))
        )
        .setMaxValues(1)
        .setMinValues(1);
      const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        dropdown
      );

      const response = await interaction.editReply({
        content: "Which snippet would you like to send?",
        components: [row]
      });

      const collector =
        response.createMessageComponentCollector<ComponentType.StringSelect>({
          time: 1000 * 60 * 60
        });

      collector.on("collect", async (selection) => {
        await selection.deferUpdate();
        const name = selection.values[0];
        const target = Snippets.find((s) => s.name === name);
        if (!target) {
          await selection.editReply({
            content: `Cannot find a snippet with the name ${name}.`
          });
          return;
        }
        await message.reply({
          content: target.response
        });
        await interaction.editReply({
          content: "Response sent!",
          components: []
        });
      });

      collector.on("end", async () => {
        /**
         * Ephemerals can be deleted. We catch the error here because we don't really
         * care if it fails.
         */
        await interaction
          .editReply({
            components: []
          })
          .catch(() => null);
      });
    } catch (err) {
      await errorHandler(bot, "snippet context", err);
    }
  }
};
