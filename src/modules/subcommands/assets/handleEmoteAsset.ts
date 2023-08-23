import { EmbedBuilder } from "discord.js";

import { AssetHandler, Emote } from "../../../interfaces/Asset";
import { errorHandler } from "../../../utils/errorHandler";
import { getAssetList } from "../../../utils/getAssetList";
import { getRandomValue } from "../../../utils/getRandomValue";
import { isAssetTarget } from "../../../utils/typeGuards";

import { defaultAssetEmbed } from "./defaultAssetEmbed";

/**
 * Fetches a random emote.
 */
export const handleEmoteAsset: AssetHandler = async (
  bot,
  target
): Promise<EmbedBuilder> => {
  try {
    if (isAssetTarget(target, ["naomi", "becca"])) {
      const fileList = await getAssetList<Emote[]>(target, "emotes");
      const file = getRandomValue(fileList);
      const { fileName, name, description } = file;
      const embed = new EmbedBuilder();
      embed.setTitle(name);
      embed.setDescription(description);
      if (target === "becca") {
        embed.addFields({
          name: "Art By:",
          value: `[Starfazers](https://starfazers.art)`,
        });
      }
      embed.setImage(`https://cdn.naomi.lgbt/${target}/emotes/${fileName}`);
      embed.setFooter({
        text: `Join our server: https://chat.naomi.lgbt`,
        iconURL: `https://cdn.nhcarrigan.com/profile.png`,
      });
      return embed;
    }

    return defaultAssetEmbed;
  } catch (err) {
    await errorHandler(bot, "handle emote asset", err);
    return defaultAssetEmbed;
  }
};
