import { APIEmbed } from "discord.js";

import { GithubIssuesPayload } from "../../interfaces/GitHubPayloads";
import { customSubstring } from "../../utils/customSubstring";

export const generateIssuesEmbed = (
  data: GithubIssuesPayload
): APIEmbed | null => {
  if (!["opened", "edited", "deleted", "closed"].includes(data.action)) {
    return null;
  }
  return {
    title: "Naomi has received a new issue!",
    url: data.issue.html_url,
    color: 0x8b4283,
    description: `An issue was ${data.action}!`,
    author: {
      name: data.sender.login || "unknown",
      icon_url:
        data.sender.avatar_url ||
        "https://cdn.nhcarrigan.com/content/profile.jpg"
    },
    fields: [
      {
        name: "Repository",
        value: data.repository.name
      },
      {
        name: "Issue Title",
        value: data.issue.title
      },
      {
        name: "Description",
        value: customSubstring(data.issue.body, 1000)
      }
    ],
    footer: {
      text: `Issue number ${data.issue.number}`
    }
  };
};
