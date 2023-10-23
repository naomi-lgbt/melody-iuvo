import { GatewayIntentBits } from "discord.js";

export const Intents = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.AutoModerationExecution,
  GatewayIntentBits.GuildVoiceStates
];
