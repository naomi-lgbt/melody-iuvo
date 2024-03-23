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
  Melody,
  target
): Promise<EmbedBuilder> => {
  try {
    let file = {
      fileName: "test",
      name: "Test Asset",
      alt: "Test Alt",
      description: "Test Description"
    };
    let index = 1;
    let total = 1;
    if (!process.env.MOCHA) {
      const fileList = await getAssetList<Pose[]>(target, "poses");
      file = getRandomValue(fileList);
      index = fileList.findIndex((f) => f.fileName === file.fileName) + 1;
      total = fileList.length;
    }
    const { fileName, name, description } = file;
    const embed = new EmbedBuilder();
    embed.setTitle(name);
    embed.setDescription(description);
    embed.setImage(`https://cdn.naomi.lgbt/${target}/koikatsu/${fileName}`);
    embed.setFooter({
      text: `Pose ${index} of ${total} (${fileName})`,
      iconURL: `https://cdn.nhcarrigan.com/avatars/${target}.png`
    });
    return embed;
  } catch (err) {
    await errorHandler(Melody, "handle koikatsu asset", err);
    return defaultAssetEmbed;
  }
};
