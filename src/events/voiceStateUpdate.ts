import { VoiceState } from "discord.js";

import { ExtendedClient } from "../interfaces/ExtendedClient";
import { errorHandler } from "../utils/errorHandler";
import { isOwner } from "../utils/isOwner";
/**
 * Handles the voiceStateUpdate event.
 *
 * @param {ExtendedClient} Melody The Melody's discord instance.
 * @param {VoiceState} oldState The old voice state payload.
 * @param {VoiceState} newState The new voice state payload.
 */
export const voiceStateUpdate = async (
  Melody: ExtendedClient,
  oldState: VoiceState,
  newState: VoiceState
) => {
  try {
    const { member } = newState;

    // only triggers for Naomi
    if (!member || !isOwner(member.id)) {
      return;
    }

    // post a message when Naomi starts streaming.
    if (!oldState.streaming && newState.streaming) {
      await Melody.discord.channels.general?.send({
        content: `Heya everyone~!\n\nNaomi is streaming in ${newState.channel}! Come join us!`
      });
    }
  } catch (err) {
    await errorHandler(Melody, "voiceStateUpdate", err);
  }
};
