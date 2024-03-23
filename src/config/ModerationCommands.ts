import { ContextMenuCommandBuilder } from "discord.js";

export type ModerationAction = "kick" | "ban" | "mute" | "unmute" | "warn";

export const ModerationCommands: ContextMenuCommandBuilder[] = [
  new ContextMenuCommandBuilder()
    .setName("kick")
    .setDMPermission(false)
    .setType(2),
  new ContextMenuCommandBuilder()
    .setName("ban")
    .setDMPermission(false)
    .setType(2),
  new ContextMenuCommandBuilder()
    .setName("mute")
    .setDMPermission(false)
    .setType(2),
  new ContextMenuCommandBuilder()
    .setName("unmute")
    .setDMPermission(false)
    .setType(2),
  new ContextMenuCommandBuilder()
    .setName("warn")
    .setDMPermission(false)
    .setType(2)
];
