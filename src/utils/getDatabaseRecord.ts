import { ExtendedClient } from "../interfaces/ExtendedClient";

/**
 * Fetches a user's record from the database.
 *
 * @param {ExtendedClient} Melody The Melody's Discord instance.
 * @param {string} userId The user ID to fetch.
 * @returns {ExtendedClient["db"]["users"]} DB record.
 */
export const getDatabaseRecord = async (
  Melody: ExtendedClient,
  userId: string
) => {
  const record = await Melody.db.users.upsert({
    where: {
      userId
    },
    update: {
      timestamp: new Date()
    },
    create: {
      userId,
      timestamp: new Date(),
      currencyDaily: new Date(0),
      currency: {
        copper: 0,
        silver: 0,
        gold: 0,
        platinum: 0,
        amethyst: 0
      },
      plurals: [],
      front: "",
      birthday: 0,
      initiations: []
    }
  });
  return record;
};
