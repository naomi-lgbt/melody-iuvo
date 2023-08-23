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
      const fileList = await getAssetList<Adventure[]>(target, "adventures");
      const file = getRandomValue(fileList);
      const { fileName, game, description } = file;
      const embed = new EmbedBuilder();
      embed.setTitle(game);
      embed.setDescription(description);
      embed.setImage(`https://cdn.naomi.lgbt/${target}/games/${fileName}`);
      embed.setFooter({
        text: `Join our server: https://chat.naomi.lgbt`,
        iconURL: `https://cdn.nhcarrigan.com/profile.png`,
      });
      return embed;
    }

    return defaultAssetEmbed;
  } catch (err) {
    await errorHandler(bot, "handle adventure asset", err);
    return defaultAssetEmbed;
  }
};
