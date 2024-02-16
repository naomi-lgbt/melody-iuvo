import { GithubPullPayload } from "../../interfaces/GitHubPayloads";

export const generatePullEmbed = (data: GithubPullPayload): string | null => {
  if (!["opened", "edited", "closed"].includes(data.action)) {
    return null;
  }
  if (data.pull_request.merged) {
    return `[Pull request merged - ${data.repository.name}#${data.pull_request.number}](<${data.pull_request.html_url}>)`;
  }
  if (data.action === "edited") {
    return `[Pull request updated - ${data.repository.name}#${data.pull_request.number}](<${data.pull_request.html_url}>)`;
  }
  if (data.action === "closed") {
    return `[Pull request closed - ${data.repository.name}#${data.pull_request.number}](<${data.pull_request.html_url}>)`;
  }
  return `[New pull request - ${data.repository.name}#${data.pull_request.number}](<${data.pull_request.html_url}>)`;
};
