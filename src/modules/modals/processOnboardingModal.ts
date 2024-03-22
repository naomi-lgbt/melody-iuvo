import {
  ComponentType,
  EmbedBuilder,
  ModalSubmitInteraction
} from "discord.js";

import { ExtendedClient } from "../../interfaces/ExtendedClient";
import { errorHandler } from "../../utils/errorHandler";

/**
 * Handles the onboarding modal submission.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @param {ModalSubmitInteraction} interaction The interaction payload from Discord.
 */
export const processOnboardingModal = async (
  bot: ExtendedClient,
  interaction: ModalSubmitInteraction
) => {
  try {
    await interaction.reply({
      ephemeral: true,
      content:
        "Thank you. Your application has been submitted. If approved, you will be granted access. If denied, you will be removed from the community."
    });

    const whyJoin = interaction.fields.getField(
      "why-join",
      ComponentType.TextInput
    );
    const howKnow = interaction.fields.getField(
      "how-know",
      ComponentType.TextInput
    );
    const aboutYou = interaction.fields.getField(
      "about-you",
      ComponentType.TextInput
    );
    const socials = interaction.fields.getField(
      "socials",
      ComponentType.TextInput
    );
    const other = interaction.fields.getField("other", ComponentType.TextInput);

    const embed = new EmbedBuilder()
      .setTitle("New Application~!")
      .setDescription(
        `${interaction.user.tag} (<@!${interaction.user.id}>) has submitted an application to join our community. If you approve this, grant them the <@&1161912565165719572> role. If you deny this, kick them.`
      )
      .addFields(
        {
          name: "Why do you want to join our community?",
          value: whyJoin.value
        },
        {
          name: "How do you know Naomi?",
          value: howKnow.value
        },
        {
          name: "Tell us more about yourself!",
          value: aboutYou.value
        },
        {
          name: "Social accounts you interact with Naomi from?",
          value: socials.value
        },
        {
          name: "Anything else you'd like to share with us?",
          value: other.value
        }
      );

    // send to onboarding hook
    await bot.env.onboardingHook.send({
      embeds: [embed]
    });
  } catch (err) {
    await errorHandler(bot, "process onboarding modal", err);
  }
};
