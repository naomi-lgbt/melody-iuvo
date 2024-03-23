import { CommandHandler } from "../../../interfaces/CommandHandler";
import { errorHandler } from "../../../utils/errorHandler";
import { getDatabaseRecord } from "../../../utils/getDatabaseRecord";

/**
 * Sets auto proxying for an identity.
 */
export const handlePluralFront: CommandHandler = async (
  Melody,
  interaction
) => {
  try {
    const name = interaction.options.getString("name");
    const record = await getDatabaseRecord(Melody, interaction.user.id);

    if (!name) {
      await Melody.db.users.update({
        where: {
          userId: interaction.user.id
        },
        data: {
          front: ""
        }
      });
      await interaction.editReply({
        content: "I have disabled auto-proxying for you."
      });
      return;
    }
    const exists = record.plurals.find((plural) => plural.name === name);

    if (!exists) {
      await interaction.editReply({
        content:
          "Please forgive me, but you do not have an identity with that name."
      });
      return;
    }

    await Melody.db.users.update({
      where: {
        userId: interaction.user.id
      },
      data: {
        front: name
      }
    });

    await interaction.editReply({
      content: `I will now auto-proxy your messages as ${name}.`
    });
  } catch (err) {
    await errorHandler(Melody, "plural delete command", err);
    await interaction.editReply({
      content:
        "Forgive me, but I failed to complete your request. Please try again later."
    });
  }
};
