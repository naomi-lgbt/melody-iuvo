import { APIEmbed } from "discord.js";

import { GithubForkPayload } from "../../interfaces/GitHubPayloads";

export const generateForkEmbed = (data: GithubForkPayload): APIEmbed => {
  return {
    title: "Naomi's project has been forked!",
    url: data.forkee.html_url,
    color: 0x8b4283,
    description: "Woah! I wonder what they'll do with it!",
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
      }
    ],
    footer: {
      text: `This has ${data.repository.forks_count} forks.`
    }
  };
};
