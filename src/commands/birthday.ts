import { SlashCommandBuilder } from "discord.js";

import { Command } from "../interfaces/Command";
import { errorHandler } from "../utils/errorHandler";
import { getDatabaseRecord } from "../utils/getDatabaseRecord";
import { validateDate } from "../utils/validateDate";

export const birthday: Command = {
  data: new SlashCommandBuilder()
    .setName("birthday")
    .setDescription("Set your birthday!")
    .addStringOption((option) =>
      option
        .setName("month")
        .setDescription("Your Birth Month")
        .setRequired(true)
        .setChoices(
          {
            name: "January",
            value: "Jan"
          },
          {
            name: "February",
            value: "Feb"
          },
          {
            name: "March",
            value: "Mar"
          },
          {
            name: "April",
            value: "Apr"
          },
          {
            name: "May",
            value: "May"
          },
          {
            name: "June",
            value: "Jun"
          },
          {
            name: "July",
            value: "Jul"
          },
          {
            name: "August",
            value: "Aug"
          },
          {
            name: "September",
            value: "Sep"
          },
          {
            name: "October",
            value: "Oct"
          },
          {
            name: "November",
            value: "Nov"
          },
          {
            name: "December",
            value: "Dec"
          }
        )
    )
    .addIntegerOption((option) =>
      option
        .setName("day")
        .setDescription("Your Birth Day (1-31)")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(31)
    ),
  run: async (bot, interaction) => {
    try {
      await interaction.deferReply();
      const month = interaction.options.getString("month", true);
      const day = interaction.options.getInteger("day", true);

      if (!validateDate(month, day)) {
        await interaction.editReply({
          content: `${month} ${day} is not a valid date!`
        });
        return;
      }

      const record = await getDatabaseRecord(bot, interaction.user.id);
      if (!record) {
        await interaction.editReply({
          content:
            "I beg your pardon, but I seem to have misplaced your records."
        });
        return;
      }

      await bot.db.users.update({
        where: {
          userId: record.userId
        },
        data: {
          birthday: new Date(`${month}-${day}-2000`).getTime()
        }
      });

      await interaction.editReply(
        `Your birthday has been set to ${month}-${day}!`
      );
    } catch (err) {
      await errorHandler(bot, "bbset command", err);
    }
  }
};
