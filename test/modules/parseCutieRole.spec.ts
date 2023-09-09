import { assert } from "chai";
import { MockGuild, MockMember, MockUser } from "discordjs-testing";

import { parseCutieRole } from "../../src/modules/parseCutieRole";

const guild = new MockGuild({
  name: "test-guild",
});
const user = new MockUser({
  username: "test-user",
  avatar: "https://cdn.nhcarrigan.com/profile.png",
  bot: false,
  system: false,
  discriminator: 0,
});
const member = new MockMember({
  guild,
  user,
});

suite("parseCutieRole", () => {
  test("should return 'nope' if the user is not a cutie", () => {
    assert.strictEqual(parseCutieRole(member as never), "nope");
  });

  test("should return 'cutie' if the member is a cutie", () => {
    member.roles.create({
      name: "cutie",
    });
    assert.strictEqual(parseCutieRole(member as never), "cutie");
  });
});
