import { assert } from "chai";

import {
  isGuildButtonCommand,
  isGuildCommandCommand,
  isAssetTarget,
  isGuildMessage,
} from "../../src/utils/typeGuards";

const mockButton: { [key: string]: unknown } = {};
const mockCommand: { [key: string]: unknown } = {};
const mockMessage: { [key: string]: unknown } = {};

suite("typeGuards: isGuildButtonCommand", () => {
  test("returns false if guild is missing", () => {
    assert.isFalse(isGuildButtonCommand(mockButton as never));
  });
  test("returns false if member is missing", () => {
    mockButton.guild = "hi";
    assert.isFalse(isGuildButtonCommand(mockButton as never));
  });
  test("returns false if member.permissions is string", () => {
    mockButton.member = { permissions: "hi" };
    assert.isFalse(isGuildButtonCommand(mockButton as never));
  });
  test("returns true when guild and member are present, and member permissions is not string", () => {
    mockButton.member = { permissions: new Map() };
    assert.isTrue(isGuildButtonCommand(mockButton as never));
  });
});

suite("typeGuards: is GuildCommandCommand", () => {
  test("returns false if guild is missing", () => {
    assert.isFalse(isGuildCommandCommand(mockCommand as never));
  });
  test("returns false if member is missing", () => {
    mockCommand.guild = "hi";
    assert.isFalse(isGuildCommandCommand(mockCommand as never));
  });
  test("returns true when guild and member are present", () => {
    mockCommand.member = "hi";
    assert.isTrue(isGuildCommandCommand(mockButton as never));
  });
});

suite("typeGuards: isGuildMessage", () => {
  test("returns false if guild is missing", () => {
    assert.isFalse(isGuildMessage(mockMessage as never));
  });
  test("returns false if member is missing", () => {
    mockMessage.guild = "hi";
    assert.isFalse(isGuildMessage(mockMessage as never));
  });
  test("returns true when guild and member are present", () => {
    mockMessage.member = "hi";
    assert.isTrue(isGuildMessage(mockMessage as never));
  });
});

suite("typeGuards: isAssetTarget", () => {
  test("returns false if not valid target", () => {
    assert.isFalse(isAssetTarget("hi", ["naomi"]));
  });
  test("returns false if target but not valid target", () => {
    assert.isFalse(isAssetTarget("becca", ["naomi"]));
  });
  test("returns true if valid target", () => {
    assert.isTrue(isAssetTarget("becca", ["naomi", "becca"]));
  });
});
