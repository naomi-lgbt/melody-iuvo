import { CommandHandler } from "../../../interfaces/CommandHandler";
import { errorHandler } from "../../../utils/errorHandler";
import { getDatabaseRecord } from "../../../utils/getDatabaseRecord";

/**
 * Deletes a new plural identity.
 */
export const handlePluralDelete: CommandHandler = async (bot, interaction) => {
  try {
    const name = interaction.options.getString("name", true);
    const record = await getDatabaseRecord(bot, interaction.user.id);
    const exists = record.plurals.find((plural) => plural.name === name);

    if (!exists) {
      await interaction.editReply({
        content:
          "Please forgive me, but you do not have an identity with that name.",
      });
      return;
    }
    record.plurals.splice(record.plurals.indexOf(exists), 1);

    await bot.db.users.update({
      where: {
        userId: interaction.user.id,
      },
      data: {
        plurals: [...record.plurals],
      },
    });

    await interaction.editReply({
      content: "I have removed that identity for you.",
    });
  } catch (err) {
    await errorHandler(bot, "plural delete command", err);
    await interaction.editReply({
      content:
        "Forgive me, but I failed to complete your request. Please try again later.",
    });
  }
};
