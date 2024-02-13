import { APIEmbed } from "discord.js";

import { GithubPullPayload } from "../../interfaces/GitHubPayloads";
import { customSubstring } from "../../utils/customSubstring";

export const generatePullEmbed = (data: GithubPullPayload): APIEmbed | null => {
  if (!["opened", "edited", "closed"].includes(data.action)) {
    return null;
  }
  const embed = {
    title: "Naomi received a pull request!",
    url: data.pull_request.html_url,
    color: 0x8b4283,
    description: `A pull request was ${data.action}`,
    author: {
      name: data.sender.login || "unknown",
      icon_url:
        data.sender.avatar_url ||
        "https://cdn.nhcarrigan.com/content/profile.jpg"
    },
    fields: [
      {
        name: "Repository",
        value: data.repository.name || "unknown"
      },
      {
        name: "Title",
        value: data.pull_request.title || "unknown"
      },
      {
        name: "Description",
        value: customSubstring(data.pull_request.body || "unknown", 1000)
      }
    ],
    footer: {
      text: `Pull Request number ${data.pull_request.number}`
    }
  };

  if (data.pull_request.merged) {
    embed.description = `A pull request was merged!`;
  }
  return embed;
};
