import { ChannelType, EmbedBuilder, SlashCommandBuilder } from "discord.js";

import { Command } from "../interfaces/Command";
import { errorHandler } from "../utils/errorHandler";

export const meeting: Command = {
  data: new SlashCommandBuilder()
    .setName("meeting")
    .setDescription("Schedule a meeting request with Naomi.")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("email")
        .setDescription(
          "The email address you'd like Naomi to use for the calendar invite."
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("date")
        .setDescription("The date you'd like to meet, in YYYY/MM/DD format.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("time")
        .setDescription(
          "The time you'd like to meet, in UTC, with format HH:MM"
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("purpose")
        .setDescription("Why do you want to meet?")
        .setRequired(true)
        .setMinLength(25)
        .setMaxLength(1000)
    ),
  run: async (bot, interaction) => {
    try {
      await interaction.deferReply({ ephemeral: true });
      if (!interaction.guild) {
        await interaction.editReply({
          content: "Forgive me, but this must be done in a server."
        });
        return;
      }
      const channel = interaction.guild.channels.cache.find(
        (c) => c.name === "covenstead"
      );
      if (!channel || channel.type !== ChannelType.GuildText) {
        await interaction.editReply({
          content:
            "Oh dear, it would appear Naomi has not configured the meeting requests channel"
        });
        return;
      }
      const email = interaction.options.getString("email", true);
      const date = interaction.options.getString("date", true);
      const time = interaction.options.getString("time", true);
      const purpose = interaction.options.getString("purpose", true);

      const [year, month, day] = date.split("/");
      const [hours, minutes] = time.split(":");

      if (!year || !month || !day || !hours || !minutes) {
        await interaction.editReply({
          content:
            "Incorrect date formatting. Please follow the descriptions carefully."
        });
        return;
      }

      const timestamp = Date.UTC(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hours),
        parseInt(minutes)
      );

      const embed = new EmbedBuilder();
      embed.setTitle(
        `${
          interaction.user.displayName || interaction.user.username
        }'s Meeting Request`
      );
      embed.setDescription(purpose);
      embed.addFields(
        {
          name: "Email",
          value: email
        },
        {
          name: "Time",
          value: `<t:${Math.floor(timestamp / 1000)}:F>`
        }
      );

      const thread = await channel.threads.create({
        name: `${
          interaction.user.displayName || interaction.user.username
        }'s Meeting Request`,
        type: ChannelType.PrivateThread
      });
      await thread.send({ embeds: [embed] });
      await thread.members.add(interaction.user);
      await thread.send({
        content: `<@!${interaction.user.id}>, this is where <@!465650873650118659> will confirm/deny your meeting request or ask questions.`
      });
    } catch (err) {
      0;
      await errorHandler(bot, "meeting command", err);
      await interaction.editReply({
        content:
          "Forgive me, but I failed to complete your request. Please try again later."
      });
    }
  }
};
