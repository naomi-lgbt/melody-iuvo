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
      let file = {
        fileName: "test",
        name: "Test Asset",
        alt: "Test Alt",
        description: "Test Description",
        artist: "Test Artist",
        url: "Test URL",
      };
      let index = 1;
      let total = 1;
      if (!process.env.MOCHA) {
        const fileList = await getAssetList<Portrait[]>(target, "adventures");
        file = getRandomValue(fileList);
        index = fileList.findIndex((f) => f.fileName === file.fileName) + 1;
        total = fileList.length;
      }

      const embed = new EmbedBuilder();
      embed.setTitle(file.name);
      embed.setDescription(file.description);
      embed.setImage(
        `https://cdn.naomi.lgbt/${target}/art/${file.fileName.replace(
          /\s/g,
          "%20"
        )}`
      );
      embed.addFields({
        name: "Art By:",
        value: `[${file.artist}](${file.url})`,
      });
      embed.setFooter({
        text: `Artwork ${index} of ${total}`,
        iconURL: `https://cdn.nhcarrigan.com/avatars/${target}.png`,
      });

      return embed;
    }

    return defaultAssetEmbed;
  } catch (err) {
    await errorHandler(bot, "handle portrait asset", err);
    return defaultAssetEmbed;
  }
};
