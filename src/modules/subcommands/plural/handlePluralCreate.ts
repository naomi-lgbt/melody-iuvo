import { CommandHandler } from "../../../interfaces/CommandHandler";
import { errorHandler } from "../../../utils/errorHandler";
import { getDatabaseRecord } from "../../../utils/getDatabaseRecord";

/**
 * Creates a new plural identity.
 */
export const handlePluralCreate: CommandHandler = async (bot, interaction) => {
  try {
    const name = interaction.options.getString("name", true);
    const avatar = interaction.options.getString("avatar", true);
    const prefix = interaction.options.getString("prefix", true);

    const record = await getDatabaseRecord(bot, interaction.user.id);

    if (record.plurals.length >= 5) {
      await interaction.editReply({
        content:
          "Please forgive me, but because I am so new at this I can only support 5 identities at this time.",
      });
      return;
    }

    const exists = record.plurals.find((plural) => plural.name === name);

    if (exists) {
      await interaction.editReply({
        content:
          "Please forgive me, but you already have an identity with that name.",
      });
      return;
    }

    await bot.db.users.update({
      where: {
        userId: interaction.user.id,
      },
      data: {
        plurals: [...record.plurals, { name, avatar, prefix }],
      },
    });

    await interaction.editReply({
      content: `I have created that identity for you. Start a message with \`${prefix} \` and I will replace it with a message sent from your identity.`,
    });
  } catch (err) {
    await errorHandler(bot, "plural create command", err);
    await interaction.editReply({
      content:
        "Forgive me, but I failed to complete your request. Please try again later.",
    });
  }
};
