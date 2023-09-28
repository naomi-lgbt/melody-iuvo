import { EmbedBuilder } from "discord.js";

import { AssetHandler } from "../../../interfaces/Asset";
import { errorHandler } from "../../../utils/errorHandler";
import { getAssetList } from "../../../utils/getAssetList";
import { getRandomValue } from "../../../utils/getRandomValue";

import { defaultAssetEmbed } from "./defaultAssetEmbed";

/**
 * Fetches a random picrew.
 */
export const handlePicrewAsset: AssetHandler = async (
  bot
): Promise<EmbedBuilder> => {
  try {
    let picrew = "test";
    let index = 1;
    let total = 1;
    if (!process.env.MOCHA) {
      const fileList = await getAssetList<string[]>("naomi", "picrew");
      picrew = getRandomValue(fileList);
      index = fileList.findIndex((f) => f === picrew) + 1;
      total = fileList.length;
    }

    const embed = new EmbedBuilder();
    embed.setTitle("Picrew!");
    embed.setImage(`https://cdn.naomi.lgbt/naomi/picrew/${picrew}`);
    embed.setFooter({
      text: `Picrew ${index} of ${total}`,
      iconURL: `https://cdn.nhcarrigan.com/avatars/naomi.png`,
    });

    return embed;
  } catch (err) {
    await errorHandler(bot, "handle picrew asset", err);
    return defaultAssetEmbed;
  }
};
