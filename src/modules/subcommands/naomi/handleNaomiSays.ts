import { AttachmentBuilder } from "discord.js";
import nodeHtmlToImage from "node-html-to-image";

import { Html } from "../../../config/Html";
import { CommandHandler } from "../../../interfaces/CommandHandler";
import { errorHandler } from "../../../utils/errorHandler";
import { isValidHex } from "../../isValidHex";
import { prefixHex } from "../../prefixHex";

/**
 * Handles the command to make Naomi say something.
 */
export const handleNaomiSays: CommandHandler = async (bot, interaction) => {
  try {
    const message = interaction.options.getString("message", true);
    const colour = interaction.options.getString("colour");
    const background = interaction.options.getString("background");

    const html = Html.replace(
      "{text}",
      isValidHex(colour) ? prefixHex(colour) : "pink"
    )
      .replace(
        "{background}",
        isValidHex(background) ? prefixHex(background) : "purple"
      )
      .replace("{message}", message)
      .replace("{size}", message.length > 100 ? "25" : "35");
    const image = await nodeHtmlToImage({
      html,
      selector: "body",
    });
    if (!(image instanceof Buffer)) {
      await interaction.editReply({
        content:
          "An error occurred while generating the image. Please try again later.",
      });
      return;
    }
    const attachment = new AttachmentBuilder(image, {
      name: "say.png",
    }).setDescription(`Naomi says: ${message}`);
    await interaction.editReply({
      files: [attachment],
    });
  } catch (err) {
    await errorHandler(bot, "naomi says command", err);
    await interaction.editReply({
      content:
        "Forgive me, but I failed to complete your request. Please try again later.",
    });
  }
};
