import { EmbedBuilder } from "discord.js";

import { Adventure, AssetHandler } from "../../../interfaces/Asset";
import { errorHandler } from "../../../utils/errorHandler";
import { getAssetList } from "../../../utils/getAssetList";
import { getRandomValue } from "../../../utils/getRandomValue";
import { isAssetTarget } from "../../../utils/typeGuards";

import { defaultAssetEmbed } from "./defaultAssetEmbed";

/**
 * Fetches a random adventure.
 */
export const handleAdventureAsset: AssetHandler = async (
  Melody,
  target
): Promise<EmbedBuilder> => {
  try {
    if (isAssetTarget(target, ["naomi", "becca", "rosalia"])) {
      let file = {
        fileName: "test",
        game: "Test Asset",
        alt: "Test Alt",
        description: "Test Description"
      };
      let index = 1;
      let total = 1;
      if (!process.env.MOCHA) {
        const fileList = await getAssetList<Adventure[]>(target, "adventures");
        file = getRandomValue(fileList);
        index = fileList.findIndex((f) => f.fileName === file.fileName) + 1;
        total = fileList.length;
      }
      const { fileName, game, description } = file;
      const embed = new EmbedBuilder();
      embed.setTitle(game);
      embed.setDescription(description);
      embed.setImage(`https://cdn.naomi.lgbt/${target}/games/${fileName}`);
      embed.setFooter({
        text: `Adventure ${index} of ${total} (${fileName})`,
        iconURL: `https://cdn.nhcarrigan.com/avatars/${target}.png`
      });
      return embed;
    }

    return defaultAssetEmbed;
  } catch (err) {
    await errorHandler(Melody, "handle adventure asset", err);
    return defaultAssetEmbed;
  }
};
