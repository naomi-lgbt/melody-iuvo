import { ExtendedClient } from "../interfaces/ExtendedClient";

/**
 * Fetches a user's record from the database.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @param {string} userId The user ID to fetch.
 * @returns {ExtendedClient["db"]["users"]} DB record.
 */
export const getDatabaseRecord = async (
  bot: ExtendedClient,
  userId: string
) => {
  const record = await bot.db.users.upsert({
    where: {
      userId,
    },
    update: {
      timestamp: new Date(),
    },
    create: {
      userId,
      timestamp: new Date(),
    },
  });
  return record;
};
