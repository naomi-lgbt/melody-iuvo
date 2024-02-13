import { APIEmbed } from "discord.js";

import { GithubStarPayload } from "../../interfaces/GitHubPayloads";

export const generateStarEmbed = (data: GithubStarPayload): APIEmbed => {
  return {
    title: "Naomi got a star!",
    url: data.repository.html_url,
    color: 0x8b4283,
    description: `The following repository has ${
      data.action === "created" ? "gained" : "lost"
    } a star.`,
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
        name: "Owner",
        value: data.repository.owner.login || "unknown"
      }
    ],
    footer: {
      text: `This repository now has ${data.repository.stargazers_count} stars.`
    }
  };
};
