import { VoiceState } from "discord.js";

import { ExtendedClient } from "../interfaces/ExtendedClient";
import { errorHandler } from "../utils/errorHandler";
import { isOwner } from "../utils/isOwner";
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
    const { member } = newState;

    // only triggers for Naomi
    if (!member || !isOwner(member.id)) {
      return;
    }

    // post a message when Naomi joins the public stream channel.
    if (
      oldState.channelId !== "1191939678958534778" &&
      newState.channelId === "1191939678958534778"
    ) {
      await bot.discord.channels.general?.send({
        content: `Heya <@&1160803262828642357>~!\n\nNaomi has joined her streaming channel! If you'd like to vibe with her **on her stream**, come hop in~!`
      });
    }

    // post a message when Naomi joins the partners stream channel.
    if (
      oldState.channelId !== "1189629885858205786" &&
      newState.channelId === "1189629885858205786"
    ) {
      await bot.discord.channels.partners?.send({
        content:
          "Heya cuties, Naomi's doing a private stream - do you want to join her?"
      });
    }

    // post a message when Naomi joins the sleepies channel.
    if (
      oldState.channelId !== "1190532402888581130" &&
      newState.channelId === "1190532402888581130"
    ) {
      await bot.discord.channels.partners?.send({
        content:
          "Shhhh... Naomi's doin' a sleep now. You can totally keep her company in the call - I've been told she makes cute noises in her sleep."
      });
    }

    // post a message when Naomi starts streaming.
    if (!oldState.streaming && newState.streaming) {
      await bot.discord.channels.general?.send({
        content: `Heya <@&1160803262828642357>~!\n\nNaomi is streaming in ${newState.channel}! Come join us!`
      });
    }
  } catch (err) {
    await errorHandler(bot, "voiceStateUpdate", err);
  }
};
