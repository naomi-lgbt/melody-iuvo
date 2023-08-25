import { Octokit } from "@octokit/rest";

import { ExtendedClient } from "../interfaces/ExtendedClient";
import { GithubData } from "../interfaces/Github";
import { errorHandler } from "../utils/errorHandler";

/**
 * Fetches open issues from our API,
 * posts them in Discord if they have not been posted yet.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 */
export const processGithubIssues = async (bot: ExtendedClient) => {
  try {
    if (!process.env.GITHUB_TOKEN || !process.env.ISSUE_CHANNEL_ID) {
      await bot.env.debugHook.send({
        content:
          "Tried to post issues, but missing GITHUB_TOKEN or ISSUE_CHANNEL_ID.",
      });
      return;
    }
    const github = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });
    const guild = await bot.guilds.fetch(bot.env.homeGuild);
    const channel = await guild.channels.fetch(process.env.ISSUE_CHANNEL_ID);
    if (!channel || !channel.isTextBased()) {
      await bot.env.debugHook.send({
        content:
          "Tried to post issues, but ISSUE_CHANNEL_ID is not a text channel.",
      });
      return;
    }
    const rawData = await fetch("https://contribute-api.naomi.lgbt/data");
    const data = (await rawData.json()) as GithubData;
    const issues = [];
    const values = Object.values(data) as GithubData["naomi-lgbt"][];
    for (const value of values) {
      const notPosted = value.issues.filter(
        (issue) => !issue.labels.find((l) => l.name === "posted to discord")
      );
      const openToContribute = notPosted.filter((i) =>
        i.labels.find(
          (l) => l.name === "help wanted" || l.name === "good first issue"
        )
      );
      issues.push(...openToContribute);
    }
    for (const issue of issues) {
      await github.issues.addLabels({
        owner: issue.repository_url.split("/")[4],
        repo: issue.repository_url.split("/")[5],
        issue_number: issue.number,
        labels: ["posted to discord"],
      });
      const isFirstTimersOnly = issue.labels.find(
        (l) => l.name === "good first issue"
      );
      const link = issue.url;
      await channel.send({
        content: isFirstTimersOnly
          ? `Forgive my intrusion, but if you are looking for an opportunity to make your first contribution to my Mistress' projects, [this issue](<${link}>) might be what you need.`
          : `Forgive my intrusion, but my Mistress is seeking your assistance with [this issue](<${link}>).`,
      });
    }
  } catch (err) {
    await errorHandler(bot, "process github issues", err);
  }
};
