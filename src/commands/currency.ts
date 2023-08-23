import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";

import { CacheChoices } from "../config/CacheChoices";
import { CurrencyItems, CurrencyName } from "../config/Currency";
import { Command } from "../interfaces/Command";
import { CommandHandler } from "../interfaces/CommandHandler";
import { handleCurrencyAbout } from "../modules/subcommands/currency/handleCurrencyAbout";
import { handleCurrencyAward } from "../modules/subcommands/currency/handleCurrencyAward";
import { handleCurrencyCache } from "../modules/subcommands/currency/handleCurrencyCache";
import { handleCurrencyItem } from "../modules/subcommands/currency/handleCurrencyItem";
import { handleCurrencyPurchase } from "../modules/subcommands/currency/handleCurrencyPurchase";
import { handleCurrencySlots } from "../modules/subcommands/currency/handleCurrencySlots";
import { handleCurrencyWallet } from "../modules/subcommands/currency/handleCurrencyWallet";
import { handleCurrencyWord } from "../modules/subcommands/currency/handleCurrencyWord";
import { errorHandler } from "../utils/errorHandler";

const handlers: { [key: string]: CommandHandler } = {
  about: handleCurrencyAbout,
  award: handleCurrencyAward,
  cache: handleCurrencyCache,
  item: handleCurrencyItem,
  purchase: handleCurrencyPurchase,
  slots: handleCurrencySlots,
  wallet: handleCurrencyWallet,
  word: handleCurrencyWord,
};

export const currency: Command = {
  data: new SlashCommandBuilder()
    .setName("currency")
    .setDescription("Play with the currency system.")
    .setDMPermission(false)
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("about")
        .setDescription(`Learn about ${CurrencyName}.`)
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("award")
        .setDescription(`Grant some ${CurrencyName} to a user`)
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("The user to give to.")
            .setRequired(true)
        )
        .addNumberOption((option) =>
          option
            .setName("amount")
            .setDescription(
              "The amount to award. Use a negative number to take away."
            )
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("cache")
        .setDescription(`Allow a member to play games a bit early.`)
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("The user to bust the cache for.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("prop")
            .setDescription("The type of cache to bust.")
            .setRequired(true)
            .addChoices(...CacheChoices)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("item")
        .setDescription("Get information about an item in the shop")
        .addStringOption((option) =>
          option
            .setName("target")
            .setDescription("The item you want to look up")
            .setRequired(true)
            .addChoices(
              ...CurrencyItems.sort((a, b) => a.name.localeCompare(b.name)).map(
                ({ name, internalId: value }) => ({ name, value })
              )
            )
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("purchase")
        .setDescription("Procure an item from our shop.")
        .addStringOption((option) =>
          option
            .setName("target")
            .setDescription("The item you want to buy.")
            .setRequired(true)
            .addChoices(
              ...CurrencyItems.sort((a, b) => a.name.localeCompare(b.name)).map(
                ({ name, internalId: value }) => ({ name, value })
              )
            )
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("slots")
        .setDescription(`Gamble your ${CurrencyName} on the slot machines!`)
        .addIntegerOption((option) =>
          option
            .setName("wager")
            .setDescription("How much do you want to bet?")
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("wallet")
        .setDescription(`See how many ${CurrencyName} you have.`)
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("word")
        .setDescription("Play a word game!")
        .addIntegerOption((option) =>
          option
            .setName("wager")
            .setDescription("How much do you want to wager?")
            .setRequired(true)
        )
    ),
  run: async (bot, interaction) => {
    try {
      await interaction.deferReply({ ephemeral: true });
      const subcommand = interaction.options.getSubcommand();
      handlers[subcommand]
        ? await handlers[subcommand](bot, interaction)
        : await interaction.editReply({
            content:
              "I have failed you once again. The command you used does not have an instruction manual for me.",
          });
    } catch (err) {
      await errorHandler(bot, "misc command", err);
      await interaction.editReply({
        content:
          "Forgive me, but I failed to complete your request. Please try again later.",
      });
    }
  },
};
