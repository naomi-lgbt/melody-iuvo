import {
  ActionRowBuilder,
  ComponentType,
  ContextMenuCommandInteraction,
  GuildMember,
  ModalBuilder,
  PermissionFlagsBits,
  TextInputBuilder,
  TextInputStyle,
  User
} from "discord.js";

import { ActionToEmote } from "../config/Emotes";
import { ModerationAction } from "../config/ModerationCommands";
import { ExtendedClient } from "../interfaces/ExtendedClient";
import { errorHandler } from "../utils/errorHandler";

/**
 * Processes all of the moderation context commands.
 *
 * @param {ExtendedClient} Melody The Melody's Discord instance.
 * @param {ContextMenuCommandInteraction} interaction The interaction payload from Discord.
 * @param {ModerationAction} action The moderation action, pulled from the command name and validated.
 * @param {User} target The Discord record of the user to action.
 */
export const processModAction = async (
  Melody: ExtendedClient,
  interaction: ContextMenuCommandInteraction,
  action: ModerationAction,
  target: User
) => {
  try {
    const { guild, member } = interaction;
    if (!guild || !member || !(member instanceof GuildMember)) {
      await interaction.reply({
        ephemeral: true,
        content: "Please run this on the user in the server."
      });
      return;
    }
    if (!member.permissions.has(PermissionFlagsBits.BanMembers)) {
      await interaction.reply({
        ephemeral: true,
        content: "You do not have permission to run this."
      });
      return;
    }
    const input = new TextInputBuilder()
      .setLabel("Reason for Actioning this User")
      .setStyle(TextInputStyle.Paragraph)
      .setCustomId("reason")
      .setRequired(true);
    const row = new ActionRowBuilder<TextInputBuilder>().addComponents(input);
    const modal = new ModalBuilder()
      .setCustomId(action)
      .setTitle(`${action}: ${target.username}`)
      .addComponents(row);
    await interaction.showModal(modal);
    const submit = await interaction.awaitModalSubmit({ time: 5 * 1000 * 60 });
    await submit.deferReply({ ephemeral: true });
    const reason = submit.fields.getField(
      "reason",
      ComponentType.TextInput
    ).value;
    const toUser = [
      `NOTICE - **${action.toUpperCase()}**\nYou have been actioned in Naomi's community.`
    ];
    const targetMember = await guild?.members.fetch(target.id);
    if (!targetMember) {
      await submit.editReply({
        content: `Cannot action ${target.username} as they are not in our community.`
      });
      return;
    }
    if (action === "ban") {
      toUser.push(
        `You may appeal at https://airtable.com/appV1cYj57zUU1Af2/pagEeCCMdz5T6cHi9/form`
      );
      await target.send(toUser.join("\n")).catch(() => null);
      await targetMember.ban({
        reason,
        deleteMessageSeconds: 1000 * 60 * 60 * 24 * 7
      });
    }
    if (action === "kick") {
      toUser.push(`You may rejoin with https://chat.naomi.lgbt`);
      await target.send(toUser.join("\n")).catch(() => null);
      await targetMember.kick(reason);
    }
    if (action === "mute") {
      toUser.push("This will expire in 24 hours.");
      await target.send(toUser.join("\n")).catch(() => null);
      await targetMember.timeout(1000 * 60 * 60 * 24, reason);
    }
    if (action === "unmute") {
      toUser.push("You may interact with our community again.");
      await target.send(toUser.join("\n")).catch(() => null);
      await targetMember.timeout(null, reason);
    }
    if (action === "warn") {
      await target.send(toUser.join("\n"));
    }
    await submit.editReply({
      content: `Processed ${action} for ${target.username}`
    });
    await Melody.discord.channels.publicModLog?.send({
      content: `${ActionToEmote[action]} **${action.toUpperCase()}**: ${target.username} (${target.id}) - ${reason}`
    });
  } catch (err) {
    await errorHandler(Melody, "process mod action", err);
  }
};
