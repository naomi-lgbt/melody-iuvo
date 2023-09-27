import { VoiceState } from "discord.js";

import { ExtendedClient } from "../interfaces/ExtendedClient";
import { errorHandler } from "../utils/errorHandler";
import { isOwner } from "../utils/isOwner";

const genChatId = "1150449576701079614";
const eventRoleId = "1154535918930231326";

/**
 * Handles the voiceStateUpdate event.
 *
 * @param {ExtendedClient} bot The bot's discord instance.
 * @param {VoiceState} oldState The old voice state payload.
 * @param {VoiceState} newState The new voice state payload.
 */
export const voiceStateUpdate = async (
  bot: ExtendedClient,
  oldState: VoiceState,
  newState: VoiceState
) => {
  try {
    const { member, guild } = newState;

    // only triggers for Naomi
    if (!member || !isOwner(member.id)) {
      return;
    }

    // do not trigger if they did not start screen sharing
    if (oldState.streaming || !newState.streaming) {
      return;
    }

    const genChat =
      guild.channels.cache.get(genChatId) ||
      (await guild.channels.fetch(genChatId));

    if (!genChat || !genChat.isTextBased()) {
      return;
    }

    await genChat.send({
      content: `Heya <@&${eventRoleId}>~!\n\nNaomi is streaming in ${newState.channel}! Come join us!`,
    });
  } catch (err) {
    await errorHandler(bot, "voiceStateUpdate", err);
  }
};
