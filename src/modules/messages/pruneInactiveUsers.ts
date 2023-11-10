import { AttachmentBuilder } from "discord.js";

import { ExtendedClient } from "../../interfaces/ExtendedClient";
import { GuildMessage } from "../../interfaces/GuildMessage";
import { errorHandler } from "../../utils/errorHandler";
import { getDatabaseRecord } from "../../utils/getDatabaseRecord";
import { logHandler } from "../../utils/logHandler";

/**
 * Handles the logic to prune inactive members.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @param {GuildMessage} message The message payload from Discord.
 */
export const pruneInactiveUsers = async (
  bot: ExtendedClient,
  message: GuildMessage
) => {
  try {
    const { partner, staff, donor, regular } = bot.discord.roles;
    const dryrun =
      message.content.includes("--dryrun") ||
      message.content.includes("--dry-run");
    const users: string[] = [];
    const records = await bot.db.users.findMany();
    const guildMembers = await message.guild.members.fetch();
    let count = 0;
    for (const user of guildMembers.values()) {
      if (user.user.bot) {
        continue;
      }
      const record = records.find((r) => r.userId === user.id);
      if (!record) {
        await getDatabaseRecord(bot, user.id);
        continue;
      }
      // we need filters
      const isPartner = partner && user.roles.cache.has(partner.id);
      const isStaff = staff && user.roles.cache.has(staff.id);
      const isDonor = donor && user.roles.cache.has(donor.id);
      const isRegular = regular && user.roles.cache.has(regular.id);
      if (isPartner || isStaff || isDonor || isRegular) {
        continue;
      }
      // check if user.timestamp is older than 30 days
      if (record.timestamp < new Date(Date.now() - 2592000000)) {
        users.push(
          `${user.user.displayName || user.user.username} (${user.id})`
        );
        if (!dryrun) {
          await user
            .kick("Failed activity requirement.")
            .catch(() => logHandler.error(`Failed to kick ${user.id}`));
          await bot.db.users.delete({
            where: {
              userId: user.id
            }
          });
        }
        count++;
      }
    }
    if (count === 0) {
      await message.reply("Found no inactive users.");
      return;
    }

    const attachment = new AttachmentBuilder(
      Buffer.from(users.join("\n"), "utf-8"),
      {
        name: "prune.txt"
      }
    );
    await message.reply({
      content: dryrun
        ? `Would kick ${count} inactive users:`
        : `Kicked ${count} inactive users:`,
      files: [attachment]
    });
    return;
  } catch (err) {
    await errorHandler(bot, "prune inactive users", err);
    await message.reply({
      content:
        "Forgive me, but I failed to complete your request. Please try again later."
    });
  }
};
