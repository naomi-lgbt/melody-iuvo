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
    const dryrun = message.content.includes("--dryrun");
    const records = await bot.db.users.findMany();
    const guildMembers = await message.guild.members.fetch();
    let count = 0;
    for (const user of guildMembers.values()) {
      if (user.user.bot || !user.kickable) {
        continue;
      }
      const record = records.find((r) => r.userId === user.id);
      if (!record) {
        await getDatabaseRecord(bot, user.id);
        continue;
      }
      // check if user.timestamp is older than 30 days
      if (record.timestamp < new Date(Date.now() - 2592000000)) {
        if (!dryrun) {
          await user
            .kick("Failed activity requirement.")
            .catch(() => logHandler.error(`Failed to kick ${user.id}`));
          await bot.db.users.delete({
            where: {
              userId: user.id,
            },
          });
        }
        count++;
      }
    }
    await message.reply(
      dryrun
        ? `Would kick ${count} inactive users.`
        : `Kicked ${count} inactive users.`
    );
    return;
  } catch (err) {
    await errorHandler(bot, "prune inactive users", err);
    await message.reply({
      content:
        "Forgive me, but I failed to complete your request. Please try again later.",
    });
  }
};
