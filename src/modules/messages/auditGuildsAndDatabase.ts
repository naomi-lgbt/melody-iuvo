import { Message } from "discord.js";

import { ExtendedClient } from "../../interfaces/ExtendedClient";
import { errorHandler } from "../../utils/errorHandler";

/**
 * Performs two audits:
 * - Removes the Melody from any guild that is not the home guild.
 * - Removes any user record from the database that does not have a matching guild member record.
 *
 * @param {ExtendedClient} Melody The Melody's Discord instance.
 * @param {Message} message The message payload from Discord.
 */
export const auditGuildsAndDatabase = async (
  Melody: ExtendedClient,
  message: Message
) => {
  try {
    if (!Melody.discord.guild) {
      await message.reply({
        content: "Home guild not configured. Cannot audit database."
      });
      return;
    }
    await message.reply({ content: "Beginning audit..." });
    const guilds = await Melody.guilds.fetch();
    if (guilds.size === 1) {
      await message.reply({ content: "I am only in this guild, thankfully." });
    } else {
      const guildsToRemove = guilds.filter(
        (g) => g.id !== Melody.discord.guild?.id
      );
      await message.reply({
        content: `Removing myself from ${guildsToRemove.size} guilds.`
      });
      for (const [id] of guildsToRemove) {
        const resolvedGuild = await Melody.guilds.fetch(id);
        await resolvedGuild.leave();
      }
    }

    const members = await Melody.discord.guild.members.fetch();
    const records = await Melody.db.users.findMany();
    if (members.size === records.length) {
      await message.reply({
        content: "There are no stray database records to remove."
      });
    } else {
      const recordsToRemove = records.filter((r) => !members.has(r.userId));
      await message.reply({ content: `Removing ${recordsToRemove} records.` });
      for (const record of recordsToRemove) {
        await Melody.db.users.delete({
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
    await errorHandler(Melody, "audit guilds and database", err);
    await message.reply({
      content: "Something went wrong, Mama. Please check your logs."
    });
  }
};
