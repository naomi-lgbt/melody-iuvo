import { EmbedBuilder } from "discord.js";

import { FocusRoles, MagicRoles, PurposeRoles } from "../config/Training";
import { ExtendedClient } from "../interfaces/ExtendedClient";
import { errorHandler } from "../utils/errorHandler";

/**
 * Posts a breakdown of the coven membership and training roles.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 */
export const announceCovenStats = async (bot: ExtendedClient) => {
  try {
    const roles = await bot.discord.guild.roles.fetch();
    const covenRole = roles.find((r) => r.id === bot.discord.roles.regular.id);
    const positiveRole = roles.find((r) => r.id === FocusRoles.positive);
    const comfortingRole = roles.find((r) => r.id === FocusRoles.comforting);
    const studiousRole = roles.find((r) => r.id === FocusRoles.studious);
    const protectiveRole = roles.find((r) => r.id === FocusRoles.protective);
    const adventurousRole = roles.find((r) => r.id === FocusRoles.adventurous);
    const lightRole = roles.find((r) => r.id === MagicRoles.light);
    const darkRole = roles.find((r) => r.id === MagicRoles.dark);
    const guardianRole = roles.find((r) => r.id === PurposeRoles.guardian);
    const foragerRole = roles.find((r) => r.id === PurposeRoles.forager);
    const librarianRole = roles.find((r) => r.id === PurposeRoles.librarian);
    const alchemistRole = roles.find((r) => r.id === PurposeRoles.alchemist);
    const wandererRole = roles.find((r) => r.id === PurposeRoles.wanderer);

    const untrained =
      (covenRole?.members.size ?? 0) -
      ((lightRole?.members.size ?? 0) + (darkRole?.members.size ?? 0));

    const embed = new EmbedBuilder();
    embed.setTitle("Coven Records");
    embed.setDescription(
      "This details the current strength of our coven. Interested in being initiated? Ask your fellow coven members about the process!"
    );
    embed.addFields(
      {
        name: "Virtues",
        value: `Positivity: ${positiveRole?.members.size ?? 0}\nComfort: ${
          comfortingRole?.members.size ?? 0
        }\nLearning: ${studiousRole?.members.size ?? 0}\nProtection: ${
          protectiveRole?.members.size ?? 0
        }\nAdventure: ${adventurousRole?.members.size ?? 0}`,
        inline: true
      },
      {
        name: "Magic",
        value: `Light Magic: ${lightRole?.members.size ?? 0}\nDark Magic: ${
          darkRole?.members.size ?? 0
        }`,
        inline: true
      },
      {
        name: "Roles",
        value: `Guardian: ${guardianRole?.members.size ?? 0}\nForager: ${
          foragerRole?.members.size ?? 0
        }\nLibrarian: ${librarianRole?.members.size ?? 0}\nAlchemist: ${
          alchemistRole?.members.size ?? 0
        }\nWanderer: ${wandererRole?.members.size ?? 0}`,
        inline: true
      },
      {
        name: "Untrained Initiates",
        value: `${untrained} (remember to use the \`/training\` command to complete your training!)`,
        inline: false
      }
    );
    await bot.discord.channels.general.send({
      embeds: [embed]
    });
  } catch (err) {
    await errorHandler(bot, "announce coven stats", err);
  }
};
