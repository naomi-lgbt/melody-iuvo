import { EmbedBuilder } from "discord.js";

import { AssetHandler, Emote } from "../../../interfaces/Asset";
import { errorHandler } from "../../../utils/errorHandler";
import { getAssetList } from "../../../utils/getAssetList";
import { getRandomValue } from "../../../utils/getRandomValue";
import { isAssetTarget } from "../../../utils/typeGuards";

import { defaultAssetEmbed } from "./defaultAssetEmbed";

/**
 * Fetches a random emote.
 */
export const handleEmoteAsset: AssetHandler = async (
  bot,
  target
): Promise<EmbedBuilder> => {
  try {
    if (isAssetTarget(target, ["naomi", "becca"])) {
      let file = {
        fileName: "test",
        name: "Test Asset",
        alt: "Test Alt",
        description: "Test Description",
      };
      let index = 1;
      let total = 1;
      if (!process.env.MOCHA) {
        const fileList = await getAssetList<Emote[]>(target, "emotes");
        file = getRandomValue(fileList);
        index = fileList.findIndex((f) => f.fileName === file.fileName) + 1;
        total = fileList.length;
      }
      const { fileName, name, description } = file;
      const embed = new EmbedBuilder();
      embed.setTitle(name);
      embed.setDescription(description);
      if (target === "becca") {
        embed.addFields({
          name: "Art By:",
          value: `[Starfazers](https://starfazers.art)`,
        });
      }
      embed.setImage(`https://cdn.naomi.lgbt/${target}/emotes/${fileName}`);
      embed.setFooter({
        text: `Adventure ${index} of ${total}`,
        iconURL: `https://cdn.nhcarrigan.com/avatars/${target}.png`,
      });
      return embed;
    }

    return defaultAssetEmbed;
  } catch (err) {
    await errorHandler(bot, "handle emote asset", err);
    return defaultAssetEmbed;
  }
};
