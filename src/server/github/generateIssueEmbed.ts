import { GithubIssuesPayload } from "../../interfaces/GitHubPayloads";

export const generateIssuesEmbed = (
  data: GithubIssuesPayload
): string | null => {
  if (!["opened", "edited", "closed"].includes(data.action)) {
    return null;
  }
  if (data.action === "closed") {
    if (data.issue.state_reason === "completed") {
      return `[Issue closed as complete - ${data.repository.name}#${data.issue.number}](<${data.issue.html_url}>)`;
    }
    if (data.issue.state_reason === "not_planned") {
      return `[Issue closed as not planned - ${data.repository.name}#${data.issue.number}](<${data.issue.html_url}>)`;
    }
    return `[Issue closed - ${data.repository.name}#${data.issue.number}](<${data.issue.html_url}>)`;
  }
  if (data.issue.state_reason === "reopened") {
    return `[Issue reopened - ${data.repository.name}#${data.issue.number}](<${data.issue.html_url}>)`;
  }
  if (data.action === "edited") {
    return `[Issue updated - ${data.repository.name}#${data.issue.number}](<${data.issue.html_url}>)`;
  }
  return `[New issue created - ${data.repository.name}#${data.issue.number}](<${data.issue.html_url}>)`;
};
