import { Message } from "discord.js";

import { ExtendedClient } from "../../interfaces/ExtendedClient";
import { errorHandler } from "../../utils/errorHandler";

/**
 * Performs two audits:
 * - Removes the bot from any guild that is not the home guild.
 * - Removes any user record from the database that does not have a matching guild member record.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @param {Message} message The message payload from Discord.
 */
export const auditGuildsAndDatabase = async (
  bot: ExtendedClient,
  message: Message
) => {
  try {
    if (!bot.discord.guild) {
      await message.reply({
        content: "Home guild not configured. Cannot audit database."
      });
      return;
    }
    await message.reply({ content: "Beginning audit..." });
    const guilds = await bot.guilds.fetch();
    if (guilds.size === 1) {
      await message.reply({ content: "I am only in this guild, thankfully." });
    } else {
      const guildsToRemove = guilds.filter(
        (g) => g.id !== bot.discord.guild?.id
      );
      await message.reply({
        content: `Removing myself from ${guildsToRemove.size} guilds.`
      });
      for (const [id] of guildsToRemove) {
        const resolvedGuild = await bot.guilds.fetch(id);
        await resolvedGuild.leave();
      }
    }

    const members = await bot.discord.guild.members.fetch();
    const records = await bot.db.users.findMany();
    if (members.size === records.length) {
      await message.reply({
        content: "There are no stray database records to remove."
      });
    } else {
      const recordsToRemove = records.filter((r) => !members.has(r.userId));
      await message.reply({ content: `Removing ${recordsToRemove} records.` });
      for (const record of recordsToRemove) {
        await bot.db.users.delete({
          where: {
            userId: record.userId
          }
        });
      }
    }
    await message.reply({
      content: "My audit is complete."
    });
  } catch (err) {
    await errorHandler(bot, "audit guilds and database", err);
    await message.reply({
      content: "Something went wrong, Mama. Please check your logs."
    });
  }
};
