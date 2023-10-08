import { scheduleJob } from "node-schedule";

import { ExtendedClient } from "../interfaces/ExtendedClient";
import { processGithubIssues } from "../modules/processGithubIssues";
import { errorHandler } from "../utils/errorHandler";
import { loadSteam } from "../utils/loadSteam";
import { mountTwitch } from "../utils/mountTwitch";
import { registerCommands } from "../utils/registerCommands";

/**
 * Handles the ClientReady event from Discord.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 */
export const clientReady = async (bot: ExtendedClient) => {
  try {
    await registerCommands(bot);
    await processGithubIssues(bot);
    await mountTwitch(bot);
    await loadSteam(bot);
    setInterval(async () => await processGithubIssues(bot), 1000 * 60 * 60);
    await bot.env.debugHook.send("Bot is ready.");

    const guild =
      bot.guilds.cache.get(bot.env.homeGuild) ||
      (await bot.guilds.fetch(bot.env.homeGuild));
    if (!guild) {
      await bot.env.debugHook.send("Cannot find home guild.");
      return;
    }
    const channel = guild.channels.cache.find((c) => c.name === "general");
    if (!channel || !channel.isTextBased()) {
      await bot.env.debugHook.send(
        "General channel not found. Twitch will not be loaded."
      );
      return;
    }

    await channel.send({
      content: "I am back from my nap!",
    });
    // at noon every day
    scheduleJob("0 12 * * *", async () => {
      await channel.send({
        content: `Remember that you can donate to support my mistress' work: <https://donate.nhcarrigan.com>`,
      });
    });
  } catch (err) {
    await errorHandler(bot, "client ready event", err);
  }
};
