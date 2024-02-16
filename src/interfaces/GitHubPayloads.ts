/**
 * The structure of the NESTED issue data from the GitHub Webhook.
 */
interface GithubIssuePayload {
  id: number;
  node_id: string;
  url: string;
  repository_url: string;
  html_url: string;
  number: number;
  state: string;
  state_reason: string | null;
  title: string;
  body: string;
  user: GithubUserPayload;
  created_at: string;
  updated_at: string;
  closed_by: GithubUserPayload;
}

interface GithubPullRequestPayload {
  html_url: string;
  body: string;
  number: number;
  merged: boolean;
  title: string;
  user: GithubUserPayload;
}

/**
 * Structure of the repo data, sent on pretty much
 * every GitHub Webhook payload.
 */
interface GithubRepoPayload {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  owner: GithubUserPayload;
  private: boolean;
  html_url: string;
  description: string;
  fork: boolean;
  url: string;
  archive_url: string;
  assignees_url: string;
  blobs_url: string;
  branches_url: string;
  collaborators_url: string;
  comments_url: string;
  commits_url: string;
  compare_url: string;
  contents_url: string;
  contributors_url: string;
  deployments_url: string;
  downloads_url: string;
  events_url: string;
  forks_url: string;
  git_commits_url: string;
  git_refs_url: string;
  git_tags_url: string;
  git_url: string;
  issue_comment_url: string;
  issue_events_url: string;
  issues_url: string;
  keys_url: string;
  labels_url: string;
  languages_url: string;
  merges_url: string;
  milestones_url: string;
  notifications_url: string;
  pulls_url: string;
  releases_url: string;
  ssh_url: string;
  stargazers_url: string;
  statuses_url: string;
  subscribers_url: string;
  subscription_url: string;
  tags_url: string;
  teams_url: string;
  trees_url: string;
  clone_url: string;
  mirror_url: string;
  hooks_url: string;
  svn_url: string;
  homepage: string;
  language: string | null;
  forks: number;
  forks_count: number;
  stargazers_count: number;
  watchers_count: number;
  watchers: number;
  size: number;
  default_branch: string;
  open_issues_count: number;
  open_issues: number;
  created_at: string;
}

interface GithubUserPayload {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string;
  company: string;
  blog: string;
  location: string;
  email: string;
  hireable: boolean;
}

/**
 * The structure of the comment data from the Github Webhook.
 */
export interface GithubCommentPayload {
  action: string;
  issue: GithubIssuePayload;
  comment: {
    html_url: string;
    body: string;
    user: GithubUserPayload;
  };
  repository: GithubRepoPayload;
  sender: GithubUserPayload;
}

export interface GithubForkPayload {
  forkee: GithubRepoPayload;
  repository: GithubRepoPayload;
  sender: GithubUserPayload;
}

/**
 * The structure of the top level issue data from the GitHub webhook.
 */
export interface GithubIssuesPayload {
  action: string;
  issue: GithubIssuePayload;
  repository: GithubRepoPayload;
  sender: GithubUserPayload;
}

/**
 * The structure of the ping payload when a new GitHub webhook
 * is initialised.
 */
export interface GithubPingPayload {
  zen: string;
  hook_id: string;
  hook: Record<string, unknown>;
  repository: GithubRepoPayload;
  organization: Record<string, unknown>;
  sender: GithubUserPayload;
}

/**
 * Structure of the pull request data from the GitHub Webhook.
 */
export interface GithubPullPayload {
  action: string;
  number: number;
  pull_request: GithubPullRequestPayload;
  repository: GithubRepoPayload;
  sender: GithubUserPayload;
}

/**
 * Structure of the star data sent from the GitHub Webhook.
 */
export interface GithubStarPayload {
  action: "created" | "deleted";
  starred_at: string;
  repository: GithubRepoPayload;
  sender: GithubUserPayload;
}
