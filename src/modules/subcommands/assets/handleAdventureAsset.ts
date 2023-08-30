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
  bot,
  target
): Promise<EmbedBuilder> => {
  try {
    if (isAssetTarget(target, ["naomi", "becca", "rosalia"])) {
      let file = {
        fileName: "test",
        game: "Test Asset",
        alt: "Test Alt",
        description: "Test Description",
      };
      if (!process.env.MOCHA) {
        const fileList = await getAssetList<Adventure[]>(target, "adventures");
        file = getRandomValue(fileList);
      }
      const { fileName, game, description } = file;
      const embed = new EmbedBuilder();
      embed.setTitle(game);
      embed.setDescription(description);
      embed.setImage(`https://cdn.naomi.lgbt/${target}/games/${fileName}`);
      return embed;
    }

    return defaultAssetEmbed;
  } catch (err) {
    await errorHandler(bot, "handle adventure asset", err);
    return defaultAssetEmbed;
  }
};
