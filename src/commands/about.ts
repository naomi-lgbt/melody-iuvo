import { exec } from "child_process";
import { readFile } from "fs/promises";
import { join } from "path";
import { promisify } from "util";

import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

import { Command } from "../interfaces/Command";
import { errorHandler } from "../utils/errorHandler";

const asyncExec = promisify(exec);

export const about: Command = {
  data: new SlashCommandBuilder()
    .setName("about")
    .setDescription("Get information about Melody.")
    .setDMPermission(false),
  run: async (Melody, interaction) => {
    try {
      await interaction.deferReply();
      const { commit } = Melody;
      const version = process.env.npm_package_version;

      const { stdout } = await asyncExec("cloc --csv --quiet src");
      const lines = stdout.split("\n").slice(1);
      const typescript = lines.find((line) => line.includes("TypeScript"));
      const [files, code] = typescript
        ? [
            typescript.split(",")[0] || "unknown",
            typescript.split(",")[4] || "unknown"
          ]
        : ["unknown", "unknown"];
      const coverageFile = await readFile(
        join(process.cwd(), "coverage", "index.html"),
        "utf-8"
      );
      const coverageTotals = coverageFile.match(
        /<div class='fl pad1y space-right2'>((?!div).)*<\/div>/gs
      );
      const lineTotals = coverageTotals
        ? coverageTotals[3]?.match(/[\d.]+%/)?.[0] || "0%"
        : "0%";

      const embed = new EmbedBuilder();
      embed.setTitle("About Melody");
      embed.setDescription(
        "Melody is Naomi's personal assistant bot, helping to manage aspects of the community here on Discord and on GitHub."
      );
      embed.addFields([
        {
          name: "Version",
          value: version
            ? `[${version}](https://github.com/naomi-lgbt/melody-iuvo/releases/tag/v${version})`
            : "Unable to parse version from package.json",
          inline: true
        },
        {
          name: "Commit",
          value: `[${commit.slice(
            0,
            7
          )}](https://github.com/naomi-lgbt/melody-iuvo/commit/${commit})`,
          inline: true
        },
        {
          name: "Source Code",
          value: "[GitHub](https://github.com/naomi-lgbt/melody-iuvo)",
          inline: true
        },
        {
          name: "Files",
          value: files,
          inline: true
        },
        {
          name: "Lines of Code",
          value: code,
          inline: true
        },
        {
          name: "Code Coverage",
          value: `[${lineTotals}](https://naomi.lgbt/melody-iuvo)`,
          inline: true
        }
      ]);
      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      await errorHandler(Melody, "about command", err);
    }
  }
};
