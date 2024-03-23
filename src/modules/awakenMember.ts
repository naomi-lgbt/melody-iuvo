import random from "random";

import { ExtendedClient } from "../interfaces/ExtendedClient";
import { errorHandler } from "../utils/errorHandler";

/**
 * Posts the "ritual" message and selects a new member to be
 * the Awakened.
 *
 * @param {ExtendedClient} Melody The Melody's Discord instance.
 */
export const awakenMember = async (Melody: ExtendedClient) => {
  try {
    const guild = Melody.discord.guild;
    const awakenedRole = Melody.discord.roles.awakened;
    if (!guild || !awakenedRole) {
      return;
    }
    const members = (await guild.members.fetch()).filter(
      (guildMember) => !guildMember.user.bot
    );
    const awakened = members.filter((m) => m.roles.cache.has(awakenedRole.id));
    for (const mem of awakened.values()) {
      mem.roles.remove(awakenedRole.id).catch(() => null);
    }
    const generator = random.uniformInt(0, members.size);
    const target = [...members.values()][generator()];
    if (!target) {
      return;
    }

    await target.roles.add(awakenedRole.id);
    await Melody.discord.channels.general?.send({
      content: `<@!${target.id}>, you have been chosen as our Awakened for the day. May this boon of a piece of Naomi's power allow you to protect us from the evils that seek to harm our coven.`
    });
    await Melody.discord.channels.general?.send({
      content:
        "https://tenor.com/view/anime-magic-magic-circle-spell-gif-8657546"
    });
  } catch (err) {
    await errorHandler(Melody, "awaken member module", err);
  }
};
