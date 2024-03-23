import { readFile } from "fs/promises";
import { join } from "path";

import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder
} from "discord.js";
import { google } from "googleapis";

import { ReferenceData } from "../config/AssetData";
import { Responses } from "../config/Responses";
import { AssetHandler, AssetTarget } from "../interfaces/Asset";
import { Command } from "../interfaces/Command";
import { getResponseKey } from "../modules/getResponseKey";
import { defaultAssetEmbed } from "../modules/subcommands/assets/defaultAssetEmbed";
import { handleAdventureAsset } from "../modules/subcommands/assets/handleAdventureAsset";
import { handleEmoteAsset } from "../modules/subcommands/assets/handleEmoteAsset";
import { handleKoikatsuAsset } from "../modules/subcommands/assets/handleKoikatsuAsset";
import { handleOutfitAsset } from "../modules/subcommands/assets/handleOutfitAsset";
import { handlePicrewAsset } from "../modules/subcommands/assets/handlePicrewAsset";
import { handlePortraitAsset } from "../modules/subcommands/assets/handlePortraitAsset";
import { handleReferenceAsset } from "../modules/subcommands/assets/handleReferenceAsset";
import { handleTattooAsset } from "../modules/subcommands/assets/handleTattooAsset";
import { errorHandler } from "../utils/errorHandler";
import { getRandomValue } from "../utils/getRandomValue";
import { isOwner } from "../utils/isOwner";

const handlers: { [key: string]: AssetHandler } = {
  adventure: handleAdventureAsset,
  emote: handleEmoteAsset,
  koikatsu: handleKoikatsuAsset,
  outfit: handleOutfitAsset,
  picrew: handlePicrewAsset,
  portrait: handlePortraitAsset,
  reference: handleReferenceAsset,
  tattoo: handleTattooAsset
};

export const assets: Command = {
  data: new SlashCommandBuilder()
    .setName("assets")
    .setDescription("Commands for various assets.")
    .setDMPermission(false)
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("outfit")
        .setDescription("Get a random outfit.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("adventure")
        .setDescription("Get a random game screenshot.")
        .addStringOption((option) =>
          option
            .setName("target")
            .setDescription("Whose adventure do you want to see?")
            .setRequired(true)
            .addChoices(
              { name: "Naomi", value: "naomi" },
              { name: "Becca", value: "becca" },
              { name: "Rosalia", value: "rosalia" }
            )
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("emote")
        .setDescription("Get a random emote.")
        .addStringOption((option) =>
          option
            .setName("target")
            .setDescription("Whose emotes do you want to see?")
            .setRequired(true)
            .addChoices(
              { name: "Naomi", value: "naomi" },
              { name: "Becca", value: "becca" }
            )
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("picrew")
        .setDescription("Get a random Picrew avatar.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("portrait")
        .setDescription("Get a random artwork.")
        .addStringOption((option) =>
          option
            .setName("target")
            .setDescription("Whose art do you want to see?")
            .setRequired(true)
            .addChoices(
              { name: "Naomi", value: "naomi" },
              { name: "Becca", value: "becca" },
              { name: "Rosalia", value: "rosalia" },
              { name: "Beccalia", value: "beccalia" }
            )
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("tattoo")
        .setDescription("Get a random tattoo.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("koikatsu")
        .setDescription("Get a random Koikatsu scene.")
        .addStringOption((option) =>
          option
            .setName("target")
            .setDescription("Whose poses do you want to see?")
            .setRequired(true)
            .addChoices(
              { name: "Naomi", value: "naomi" },
              { name: "Becca", value: "becca" },
              { name: "Rosalia", value: "rosalia" },
              { name: "Beccalia", value: "beccalia" },
              { name: "Novas", value: "novas" },
              { name: "Melody", value: "melody" }
            )
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("reference")
        .setDescription("Get a reference for Naomi art.")
        .addStringOption((option) =>
          option
            .setName("target")
            .setDescription("The type of reference to get.")
            .setRequired(true)
            .addChoices(
              ...ReferenceData.map((ref) => ({
                name: ref.name,
                value: ref.name
              }))
            )
        )
    ),
  run: async (Melody, interaction) => {
    try {
      await interaction.deferReply();
      const subcommand = interaction.options.getSubcommand();
      const target = interaction.options.getString("target") || "";
      const handler = handlers[subcommand];
      const embed = handler
        ? await handler(Melody, target as AssetTarget)
        : defaultAssetEmbed;
      await interaction.editReply({
        content:
          subcommand === "outfit"
            ? getRandomValue(
                Responses.outfit[getResponseKey(Melody, interaction.member)]
              )
            : "",
        embeds: [embed]
      });
      if (subcommand === "outfit" && isOwner(interaction.user.id)) {
        const fileName = embed.data.footer?.text
          .replace(/.*\((.*)\)/, "$1")
          .replace(".png", "");
        if (!fileName) {
          return;
        }
        const mapped = fileName
          .split("-")
          .map((w) => w[0]?.toUpperCase() + w.slice(1));
        const result = `Naomi (${mapped.join(" ")}).vrm`;
        const tokenContent = await readFile(
          join(process.cwd(), "calendar", "token.json"),
          "utf-8"
        );
        const credentials = JSON.parse(tokenContent);
        const client = google.auth.fromJSON(credentials);
        // @ts-expect-error type def is weird?
        const drive = google.drive({ version: "v3", auth: client });
        const files = await drive.files.list({
          pageSize: 1,
          q: `name = "${result}"`
        });
        const file = files.data.files?.[0];
        if (!file) {
          await Melody.env.debugHook.send({
            content: `Failed to load drive file: ${result}`,
            username: Melody.user?.username ?? "Melody",
            avatarURL:
              Melody.user?.displayAvatarURL() ??
              "https://cdn.nhcarrigan.com/avatars/nhcarrigan.png"
          });
          await Melody.env.debugHook.send({
            content: JSON.stringify(file, null, 2)
          });
          return;
        }
        const button = new ButtonBuilder()
          .setStyle(ButtonStyle.Link)
          .setLabel("Download VRM")
          .setURL(`https://drive.google.com/file/d/${file.id}/view`);
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
        await interaction.editReply({
          components: [row]
        });
      }
    } catch (err) {
      await errorHandler(Melody, "assets command", err);
      await interaction.editReply({
        content:
          "Forgive me, but I failed to complete your request. Please try again later."
      });
    }
  }
};
