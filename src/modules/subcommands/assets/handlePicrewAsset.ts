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
    if (!process.env.MOCHA) {
      const fileList = await getAssetList<string[]>("naomi", "picrew");
      picrew = getRandomValue(fileList);
    }

    const embed = new EmbedBuilder();
    embed.setTitle("Picrew!");
    embed.setImage(`https://cdn.naomi.lgbt/naomi/picrew/${picrew}`);

    return embed;
  } catch (err) {
    await errorHandler(bot, "handle picrew asset", err);
    return defaultAssetEmbed;
  }
};
