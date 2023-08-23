import { EmbedBuilder } from "discord.js";

import { AssetHandler, Pose } from "../../../interfaces/Asset";
import { errorHandler } from "../../../utils/errorHandler";
import { getAssetList } from "../../../utils/getAssetList";
import { getRandomValue } from "../../../utils/getRandomValue";

import { defaultAssetEmbed } from "./defaultAssetEmbed";

/**
 * Fetches a random Koikatsu scene.
 */
export const handleKoikatsuAsset: AssetHandler = async (
  bot,
  target
): Promise<EmbedBuilder> => {
  try {
    const fileList = await getAssetList<Pose[]>(target, "poses");
    const file = getRandomValue(fileList);
    const { fileName, name, description } = file;
    const embed = new EmbedBuilder();
    embed.setTitle(name);
    embed.setDescription(description);
    embed.setImage(`https://cdn.naomi.lgbt/${target}/koikatsu/${fileName}`);
    embed.setFooter({
      text: `Join our server: https://chat.naomi.lgbt`,
      iconURL: `https://cdn.nhcarrigan.com/profile.png`,
    });
    return embed;
  } catch (err) {
    await errorHandler(bot, "handle koikatsu asset", err);
    return defaultAssetEmbed;
  }
};
