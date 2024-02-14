import { GithubCommentPayload } from "../../interfaces/GitHubPayloads";

export const generateCommentEmbed = (data: GithubCommentPayload): string => {
  return `[New comment detected on ${data.repository.name}#${data.issue.number}.](<${data.comment.html_url}>)`;
};
