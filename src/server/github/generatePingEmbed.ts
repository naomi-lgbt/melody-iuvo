import { GithubPingPayload } from "../../interfaces/GitHubPayloads";

export const generatePingEmbed = (data: GithubPingPayload): string => {
  return `[Now watching ${data.repository.name}](<${data.repository.url}>)`;
};
