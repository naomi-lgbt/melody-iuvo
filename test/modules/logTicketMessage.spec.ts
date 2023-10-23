import { readFile, unlink } from "fs/promises";
import { join } from "path";

import { assert } from "chai";
import { ChannelType } from "discord.js";
import { MockChannel, MockUser } from "discordjs-testing";

import { createLogFile } from "../../src/modules/createLogFile";
import { logTicketMessage } from "../../src/modules/logTicketMessage";

const channel = new MockChannel({
  name: "test-channel",
  type: ChannelType.PublicThread
});
const user = new MockUser({
  username: "Test User",
  avatar: "test",
  discriminator: 1234,
  bot: false,
  system: false
});

suite("logTicketMessage", () => {
  test("Should appropriately log a message", async () => {
    const message = await channel.send("hi", user);
    await createLogFile(
      { ticketLogs: {} } as never,
      "channel",
      "Test User",
      "test"
    );
    await logTicketMessage({} as never, message as never, "channel");
    const path = join(process.cwd(), "logs", "channel.txt");
    const contents = await readFile(path, "utf-8");
    assert.match(contents, /- Test User#1234: hi/);
    await unlink(path);
  });
});
