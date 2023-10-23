import { EmbedBuilder } from "discord.js";

import { AssetHandler } from "../../../interfaces/Asset";
import { errorHandler } from "../../../utils/errorHandler";

import { defaultAssetEmbed } from "./defaultAssetEmbed";

/**
 * Fetches a random tattoo.
 *
 * @returns {Promise<EmbedBuilder>} The tattoo embed.
 */
export const handleTattooAsset: AssetHandler = async (
  bot
): Promise<EmbedBuilder> => {
  try {
    let tattoo = {
      fileName: "test",
      name: "Test Asset"
    };
    if (!process.env.MOCHA) {
      const tattooData = await fetch(
        "https://www.naomi.lgbt/assets/data/tattoos.json"
      );
      const tattoos: { fileName: string; name: string }[] =
        await tattooData.json();
      tattoo = tattoos[Math.floor(Math.random() * tattoos.length)];
    }

    const embed = new EmbedBuilder();
    embed.setTitle(tattoo.name);
    embed.setDescription(
      "Naomi's tattoos can be hidden or visible at her whim."
    );
    embed.setImage(
      `https://cdn.naomi.lgbt/naomi/ref/tattoos/${tattoo.fileName}`
    );

    return embed;
  } catch (err) {
    await errorHandler(bot, "handle tattoo asset", err);
    return defaultAssetEmbed;
  }
};
