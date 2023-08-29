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
    let file = {
      fileName: "test",
      name: "Test Asset",
      alt: "Test Alt",
      description: "Test Description",
    };
    if (!process.env.MOCHA) {
      const fileList = await getAssetList<Pose[]>(target, "poses");
      file = getRandomValue(fileList);
    }
    const { fileName, name, description } = file;
    const embed = new EmbedBuilder();
    embed.setTitle(name);
    embed.setDescription(description);
    embed.setImage(`https://cdn.naomi.lgbt/${target}/koikatsu/${fileName}`);
    return embed;
  } catch (err) {
    await errorHandler(bot, "handle koikatsu asset", err);
    return defaultAssetEmbed;
  }
};
