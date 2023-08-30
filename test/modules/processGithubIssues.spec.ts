import { assert } from "chai";

import { processGithubIssues } from "../../src/modules/processGithubIssues";

const fakeClient = {
  env: {
    debugHook: {
      messages: [] as { content: string }[],
      send: (msg: { content: string }) =>
        fakeClient.env.debugHook.messages.push(msg),
    },
  },
};

suite("processGithubIssues", () => {
  test("should not post when missing environment variables", async () => {
    await processGithubIssues(fakeClient as never);
    assert.lengthOf(fakeClient.env.debugHook.messages, 1);
    assert.equal(
      fakeClient.env.debugHook.messages[0]?.content,
      "Tried to post issues, but missing GITHUB_TOKEN or ISSUE_CHANNEL_ID."
    );
  });
});
