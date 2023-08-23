import { EmbedBuilder } from "discord.js";

import { AssetHandler, Portrait } from "../../../interfaces/Asset";
import { errorHandler } from "../../../utils/errorHandler";
import { getAssetList } from "../../../utils/getAssetList";
import { getRandomValue } from "../../../utils/getRandomValue";
import { isAssetTarget } from "../../../utils/typeGuards";

import { defaultAssetEmbed } from "./defaultAssetEmbed";

/**
 * Fetches a random artwork.
 */
export const handlePortraitAsset: AssetHandler = async (
  bot,
  target
): Promise<EmbedBuilder> => {
  try {
    if (isAssetTarget(target, ["naomi", "becca", "rosalia", "beccalia"])) {
      const portraitData = await getAssetList<Portrait[]>(target, "portraits");
      const portrait = getRandomValue(portraitData);

      const embed = new EmbedBuilder();
      embed.setTitle(portrait.name);
      embed.setDescription(portrait.description);
      embed.setImage(
        `https://cdn.naomi.lgbt/${target}/art/${portrait.fileName.replace(
          /\s/g,
          "%20"
        )}`
      );
      embed.addFields({
        name: "Art By:",
        value: `[${portrait.artist}](${portrait.url})`,
      });
      embed.setFooter({
        text: `Join our server: https://chat.naomi.lgbt`,
        iconURL: `https://cdn.nhcarrigan.com/profile.png`,
      });

      return embed;
    }

    return defaultAssetEmbed;
  } catch (err) {
    await errorHandler(bot, "handle portrait asset", err);
    return defaultAssetEmbed;
  }
};
