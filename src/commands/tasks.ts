import { graphql } from "@octokit/graphql";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder
} from "discord.js";

import { ProjectCardSortOrder } from "../config/Github";
import { Command } from "../interfaces/Command";
import { GitHubProjectGraphQL } from "../interfaces/Github";
import { errorHandler } from "../utils/errorHandler";

export const tasks: Command = {
  data: new SlashCommandBuilder()
    .setName("tasks")
    .setDescription("See what Naomi is working on~!")
    .setDMPermission(false),
  run: async (bot, interaction) => {
    try {
      await interaction.deferReply();

      const github = graphql.defaults({
        headers: {
          authorization: `token ${process.env.GITHUB_TOKEN}`
        }
      });
      const projects = await github<GitHubProjectGraphQL>(`
      {
        node(id: "PVT_kwHOA87hm84AY6TQ") {
          ... on ProjectV2 {
            items(first: 100) {
              nodes {
                id
                fieldValues(first: 10) {
                  nodes{                
                    ... on ProjectV2ItemFieldTextValue {
                      text
                      field {
                        ... on ProjectV2FieldCommon {
                          name
                        }
                      }
                    }
                    ... on ProjectV2ItemFieldDateValue {
                      date
                      field {
                        ... on ProjectV2FieldCommon {
                          name
                        }
                      }
                    }
                    ... on ProjectV2ItemFieldSingleSelectValue {
                      name
                      field {
                        ... on ProjectV2FieldCommon {
                          name
                        }
                      }
                    }
                  }
                }
                content {
                  ... on DraftIssue {
                    title
                  }
                  ... on Issue {
                    title
                  }
                  ... on PullRequest {
                    title
                  }
                }
              }
            }
          }
        }
      }
      `);

      const count = projects.node.items.nodes.length;
      const result = projects.node.items.nodes
        .filter((node) => node.content)
        .map((node) => {
          const title = node.content?.title;
          const status = node.fieldValues?.nodes?.find(
            (n) => n?.field?.name === "Status"
          )?.name;
          const due = node.fieldValues?.nodes?.find(
            (n) => n?.field?.name === "Due"
          )?.date;
          const org = node.fieldValues?.nodes?.find(
            (n) => n?.field?.name === "Org"
          )?.name;

          return `- ${title} (for ${org}) - ${status} - Due on ${due}`;
        })
        .sort((a, b) => {
          const [, aStatus, aRawDate] = a.split(" - ") as [
            string,
            string,
            string
          ];
          const [, bStatus, bRawDate] = b.split(" - ") as [
            string,
            string,
            string
          ];
          const aStatusIndex = ProjectCardSortOrder.indexOf(aStatus);
          const bStatusIndex = ProjectCardSortOrder.indexOf(bStatus);
          if (aRawDate.endsWith("undefined")) {
            return 1;
          }
          if (bRawDate.endsWith("undefined")) {
            return -1;
          }
          const aDate = new Date(aRawDate.replace("Due on ", ""));
          const bDate = new Date(bRawDate.replace("Due on ", ""));
          if (aDate < bDate) {
            return -1;
          }
          if (bDate < aDate) {
            return 1;
          }
          return aStatusIndex - bStatusIndex;
        })
        .slice(0, 10)
        .join("\n");

      const embed = new EmbedBuilder();
      embed.setTitle("Mama Naomi's Tasks");
      embed.setDescription(result);
      embed.setFooter({
        text: `Mama has ${count} tickets on her task board currently.`
      });

      const button = new ButtonBuilder()
        .setLabel("View All Tasks")
        .setStyle(ButtonStyle.Link)
        .setURL("https://github.com/users/naomi-lgbt/projects/5/views/1");
      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
      await interaction.editReply({
        embeds: [embed],
        components: [row]
      });
    } catch (err) {
      await errorHandler(bot, "tasks command", err);
    }
  }
};
