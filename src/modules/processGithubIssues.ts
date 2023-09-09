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
    const rawData = await fetch("https://contribute-api.naomi.lgbt/data");
    const data = (await rawData.json()) as GithubData;
    delete data.updatedAt;
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
    if (!issues.length) {
      return;
    }
    const formatted = issues
      .map((i) => `- [${i.title}](<${i.url}>)`)
      .join("\n");
    for (const issue of issues) {
      await github.issues.addLabels({
        owner: issue.repository_url.split("/")[4],
        repo: issue.repository_url.split("/")[5],
        issue_number: issue.number,
        labels: ["posted to discord"],
      });
    }
    await bot.env.issuesHook.send({
      content: `Forgive my intrusion, but it would seem my Mistress is seeking your assistance with her work.\n\n${formatted}`,
    });
  } catch (err) {
    await errorHandler(bot, "process github issues", err);
  }
};
