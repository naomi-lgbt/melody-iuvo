import { GithubForkPayload } from "../../interfaces/GitHubPayloads";

export const generateForkEmbed = (data: GithubForkPayload): string => {
  return `[New fork detected - ${data.repository.name}](<${data.forkee.html_url}>)`;
};
