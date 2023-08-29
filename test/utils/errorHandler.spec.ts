import { assert } from "chai";

import { ExtendedClient } from "../../src/interfaces/ExtendedClient";
import { errorHandler } from "../../src/utils/errorHandler";

const fakeClient = {
  env: {
    debugHook: {
      messages: [] as unknown[],
      send: (message: unknown) =>
        fakeClient.env.debugHook.messages.push(message),
    },
  },
};

const error = new Error("test");

suite("errorHandler", () => {
  test("sends a message to the webhook", async () => {
    const typeCastClient = fakeClient as unknown as ExtendedClient;
    await errorHandler(typeCastClient, "test", error);
    assert.lengthOf(fakeClient.env.debugHook.messages, 1);
  });

  test("sends the correct embed data", () => {
    assert.deepEqual(fakeClient.env.debugHook.messages, [
      {
        embeds: [
          {
            data: {
              title: "Error in `test`!",
              description: `\`\`\`${error.stack}\`\`\``,
              fields: [
                {
                  name: "Message",
                  value: error.message,
                },
              ],
            },
          },
        ],
      },
    ]);
  });
});
