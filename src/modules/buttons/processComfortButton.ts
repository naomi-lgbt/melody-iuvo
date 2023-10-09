import { ChannelType, TextChannel } from "discord.js";

import { ButtonHandler } from "../../interfaces/ButtonHandler";
import { errorHandler } from "../../utils/errorHandler";

/**
 * Generates the modal for opening a new ticket.
 */
export const processComfortButton: ButtonHandler = async (bot, interaction) => {
  try {
    await interaction.deferReply({ ephemeral: true });
    const { user, channel } = interaction;

    if (!channel || !("threads" in channel)) {
      await interaction.editReply({
        content: "It would seem this channel doesn't support threads.",
      });
      return;
    }

    const thread = await (channel as TextChannel).threads.create({
      name: `comfort-${user.username}`,
      type: ChannelType.PrivateThread,
    });
    await thread.members.add("465650873650118659");
    await thread.members.add(user.id);

    await thread.send(
      `Hey <@!465650873650118659>, it would seem that <@!${user.id}> is seeking some reassurance.`
    );
    await interaction.editReply({
      content: "Your thread has been created.",
    });
  } catch (err) {
    await errorHandler(bot, "process comfort button", err);
    await interaction.editReply({
      content:
        "Forgive me, but I failed to complete your request. Please try again later.",
    });
  }
};
