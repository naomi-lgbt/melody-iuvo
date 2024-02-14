import { GithubStarPayload } from "../../interfaces/GitHubPayloads";

export const generateStarEmbed = (data: GithubStarPayload): string | null => {
  if (data.action !== "created") {
    return null;
  }
  return `[New stargazer! ${data.repository.name}](<${data.repository.html_url}>)`;
};
