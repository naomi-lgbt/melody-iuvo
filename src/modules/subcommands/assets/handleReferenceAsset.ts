import { EmbedBuilder } from "discord.js";

import { ReferenceData } from "../../../config/AssetData";
import { AssetHandler } from "../../../interfaces/Asset";
import { logHandler } from "../../../utils/logHandler";

import { defaultAssetEmbed } from "./defaultAssetEmbed";

/**
 * Generates a reference image embed.
 */
export const handleReferenceAsset: AssetHandler = async (
  _bot,
  target: string
): Promise<EmbedBuilder> => {
  const reference = ReferenceData.find((ref) => ref.name === target);

  if (!reference) {
    logHandler.warn(`No reference found for ${target}.`);
    return defaultAssetEmbed;
  }

  const embed = new EmbedBuilder();
  embed.setTitle(reference.name);
  embed.setDescription(reference.description);
  embed.setImage(`https://cdn.naomi.lgbt/naomi/ref/${reference.fileName}`);

  return embed;
};
