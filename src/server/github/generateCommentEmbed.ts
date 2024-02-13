import { APIEmbed } from "discord.js";

import { GithubCommentPayload } from "../../interfaces/GitHubPayloads";

export const generateCommentEmbed = (data: GithubCommentPayload): APIEmbed => {
  return {
    title: "Naomi got a new comment!",
    url: data.comment.html_url,
    color: 0x8b4283,
    description: `A comment was ${data.action}`,
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
        name: "Comment",
        value: data.comment.body || "unknown"
      }
    ],
    footer: {
      text: `Issue number ${data.issue.number}`
    }
  };
};
