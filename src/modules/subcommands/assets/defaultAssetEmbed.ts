import { EmbedBuilder } from "discord.js";

export const defaultAssetEmbed = new EmbedBuilder()
  .setTitle("Oh dear!")
  .setDescription("I have failed to locate that asset. Please forgive me.")
  .setColor(0xff0000);
