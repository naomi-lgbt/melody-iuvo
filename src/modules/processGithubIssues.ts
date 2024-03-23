import { Octokit } from "@octokit/rest";

import { ExtendedClient } from "../interfaces/ExtendedClient";
import { GithubData } from "../interfaces/Github";
import { errorHandler } from "../utils/errorHandler";

/**
 * Fetches open issues from our API,
 * posts them in Discord if they have not been posted yet.
 *
 * @param {ExtendedClient} Melody The Melody's Discord instance.
 */
export const processGithubIssues = async (Melody: ExtendedClient) => {
  try {
    if (!process.env.GITHUB_TOKEN || !process.env.ISSUE_CHANNEL_ID) {
      await Melody.env.debugHook.send({
        content:
          "Tried to post issues, but missing GITHUB_TOKEN or ISSUE_CHANNEL_ID.",
        username: Melody.user?.username ?? "Melody",
        avatarURL:
          Melody.user?.displayAvatarURL() ??
          "https://cdn.nhcarrigan.com/avatars/nhcarrigan.png"
      });
      return;
    }
    const github = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });
    const rawData = await fetch("https://contribute-api.naomi.lgbt/data");
    const data = (await rawData.json()) as GithubData;
    delete data.updatedAt;
    const issues = [];
    const mentorship = [];
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
      const forMentorship = notPosted.filter((i) =>
        i.labels.find((l) => l.name === "🧠 mentorship")
      );
      issues.push(...openToContribute);
      mentorship.push(...forMentorship);
    }

    if (issues.length) {
      const formatted = issues
        .map((i) => `- [${i.title.replace(/@/g, "\\@")}](<${i.url}>)`)
        .join("\n");
      for (const issue of issues) {
        const owner = issue.repository_url.split("/")[4];
        const repo = issue.repository_url.split("/")[5];
        if (!owner || !repo) {
          continue;
        }
        await github.issues.addLabels({
          owner,
          repo,
          issue_number: issue.number,
          labels: ["posted to discord"]
        });
      }
      await Melody.discord.channels.contributing?.send({
        content: `Forgive my intrusion, but it would seem our Mama is seeking your assistance with her work.\n\n${formatted}`
      });
    }

    if (mentorship.length) {
      const formattedMentor = mentorship
        .map((i) => `- [${i.title.replace(/@/g, "\\@")}](<${i.url}>)`)
        .join("\n");
      for (const issue of mentorship) {
        const owner = issue.repository_url.split("/")[4];
        const repo = issue.repository_url.split("/")[5];
        if (!owner || !repo) {
          continue;
        }
        await github.issues.addLabels({
          owner,
          repo,
          issue_number: issue.number,
          labels: ["posted to discord"]
        });
      }
      await Melody.discord.channels.training?.send({
        content: `Heya <@&${Melody.discord.roles.mentee?.id}>~! Naomi has curated an issue specifically for one of you to take.\n\n${formattedMentor}`
      });
    }
  } catch (err) {
    await errorHandler(Melody, "process github issues", err);
  }
};
