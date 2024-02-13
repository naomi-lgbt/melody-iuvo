import { APIEmbed } from "discord.js";

import { GithubPingPayload } from "../../interfaces/GitHubPayloads";

export const generatePingEmbed = (data: GithubPingPayload): APIEmbed => {
  return {
    title: "Naomi has a new project!",
    url: data.repository.html_url,
    color: 0x8b4283,
    description: `I will now watch for activity on the \`${data.repository.name}\` project.`,
    author: {
      name: data.sender.login || "unknown",
      icon_url:
        data.sender.avatar_url || "https://cdn.nhcarrigan.com/profile.png"
    },
    fields: [
      {
        name: "Owner",
        value: data.repository.owner.login || "Unknown."
      },
      {
        name: "Description",
        value: data.repository.description || "None provided."
      }
    ],
    footer: {
      text: data.zen
    }
  };
};
