import { GithubIssuesPayload } from "../../interfaces/GitHubPayloads";

export const generateIssuesEmbed = (
  data: GithubIssuesPayload
): string | null => {
  if (!["opened", "edited", "deleted", "closed"].includes(data.action)) {
    return null;
  }
  return `[New issue created - ${data.repository.name}#${data.issue.number}](<${data.issue.html_url}>)`;
};
