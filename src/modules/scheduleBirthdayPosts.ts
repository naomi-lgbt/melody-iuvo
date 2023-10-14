import { EmbedBuilder } from "discord.js";

import { BirthdayGifs, CryingGifs } from "../config/BirthdayGifs";
import { ExtendedClient } from "../interfaces/ExtendedClient";
import { errorHandler } from "../utils/errorHandler";
import { getRandomValue } from "../utils/getRandomValue";

/**
 * Function to schedule birthday posts.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 */
export const scheduleBirthdayPosts = async (bot: ExtendedClient) => {
  try {
    const today = new Date();
    const birthday = new Date(
      `${today.getMonth() + 1}-${today.getDate()}-2000`
    ).getTime();
    const birthdays = await bot.db.users.findMany({
      where: {
        birthday,
      },
    });

    const ids = birthdays.map((doc) => `<@!${doc.userId}>`);

    if (!ids.length) {
      const noEmbed = new EmbedBuilder();
      noEmbed.setTitle("Oh no! 🙁");
      noEmbed.setDescription(
        "There are no birthdays today. 😭\n\nDon't forget you can use the `/birthday` command to set your birthday!"
      );
      noEmbed.setImage(getRandomValue(CryingGifs));

      await bot.general.send({
        embeds: [noEmbed],
      });
      return;
    }

    const embed = new EmbedBuilder();
    embed.setTitle("Happy Birthday~! 🎉🥳🎊");
    embed.setDescription(
      "We hope you have an absolutely stupendous and wonderful day! 🎂🎈🎁\n\nFriends, feel free to share your birthday wishes! 💜"
    );
    embed.setImage(getRandomValue(BirthdayGifs));

    await bot.general.send({
      content: `${ids.join(", ")}`,
      embeds: [embed],
    });
  } catch (err) {
    await errorHandler(bot, "scheduled birthday post", err);
  }
};
