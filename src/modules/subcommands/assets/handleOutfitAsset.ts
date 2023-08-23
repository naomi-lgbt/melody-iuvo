import { EmbedBuilder } from "discord.js";

import { AssetHandler, Outfit } from "../../../interfaces/Asset";
import { errorHandler } from "../../../utils/errorHandler";
import { getAssetList } from "../../../utils/getAssetList";
import { getRandomValue } from "../../../utils/getRandomValue";

import { defaultAssetEmbed } from "./defaultAssetEmbed";

/**
 * Fetches a random outfit.
 */
export const handleOutfitAsset: AssetHandler = async (
  bot
): Promise<EmbedBuilder> => {
  try {
    const fileData = await getAssetList<Outfit[]>("naomi", "outfits");
    const outfit = getRandomValue(fileData);

    const embed = new EmbedBuilder();
    embed.setTitle(outfit.name);
    embed.setDescription(outfit.description);
    embed.setImage(`https://cdn.naomi.lgbt/naomi/outfits/${outfit.fileName}`);
    embed.setFooter({
      text: `Join our server: https://chat.naomi.lgbt`,
      iconURL: `https://cdn.nhcarrigan.com/profile.png`,
    });

    return embed;
  } catch (err) {
    await errorHandler(bot, "handle outfit asset", err);
    return defaultAssetEmbed;
  }
};
