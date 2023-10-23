import { assert } from "chai";
import { MockGuild, MockMember, MockUser } from "discordjs-testing";

import { getResponseKey } from "../../src/modules/getResponseKey";

const guild = new MockGuild({
  name: "test-guild"
});
const user = new MockUser({
  username: "test-user",
  avatar: "https://cdn.nhcarrigan.com/profile.png",
  bot: false,
  system: false,
  discriminator: 0
});
const member = new MockMember({
  guild,
  user
});

suite("getResponseKey", () => {
  test("should return default if no conditions are met", () => {
    assert.strictEqual(getResponseKey(member as never), "default");
  });

  test("should return 'cute' if the member is a cutie", () => {
    member.roles.create({
      name: "cutie"
    });
    assert.strictEqual(getResponseKey(member as never), "cutie");
  });

  test("should return the user ID if there is individual response", () => {
    // @ts-expect-error Overriding id for testing
    member._id = "465650873650118659";
    assert.strictEqual(getResponseKey(member as never), "465650873650118659");
  });
});
