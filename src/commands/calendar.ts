import { readFile } from "fs/promises";
import { join } from "path";

import { SlashCommandBuilder } from "discord.js";
import { google } from "googleapis";

import { Command } from "../interfaces/Command";
import { errorHandler } from "../utils/errorHandler";

const tokenPath = join(process.cwd(), "calendar", "token.json");

export const calendar: Command = {
  data: new SlashCommandBuilder()
    .setName("calendar")
    .setDescription("See Naomi's upcoming events.")
    .setDMPermission(false),
  run: async (bot, interaction) => {
    try {
      await interaction.deferReply();
      const tokenContent = await readFile(tokenPath, "utf-8");
      const credentials = JSON.parse(tokenContent);
      const client = google.auth.fromJSON(credentials);
      // @ts-expect-error Type def?
      const calendar = google.calendar({ version: "v3", auth: client });
      const calendarIds = process.env.GOOGLE_CALENDAR_IDS?.split(",");
      if (!calendarIds || !calendarIds.length) {
        return;
      }
      const eventData: { start: Date; end: Date; title: string }[] = [];
      for (const calendarId of calendarIds) {
        const events = await calendar.events.list({
          calendarId,
          timeMin: new Date().toISOString(),
          timeMax: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
          timeZone: "America/Los Angeles",
          singleEvents: true
        });
        if (!events.data.items) {
          continue;
        }
        const calendarName = calendarId.split("@")[1]?.split(".")[0];
        eventData.push(
          ...events.data.items.map((item) => ({
            start: new Date(
              item.start?.date ?? item.start?.dateTime ?? Date.now()
            ),
            end: new Date(item.end?.date ?? item.end?.dateTime ?? Date.now()),
            title: calendarName === "gmail" ? "Personal Event" : `Meeting`
          }))
        );
      }
      const eventList = eventData
        .sort((a, b) => {
          if (a.start <= new Date() && b.start <= new Date()) {
            return 0;
          }
          if (a.start <= new Date()) {
            return -1;
          }
          if (b.start <= new Date()) {
            return 1;
          }
          return a.start.getTime() - b.start.getTime();
        })
        .map((i) =>
          i.start.getTime() < Date.now()
            ? `- ALL DAY - ${i.title}`
            : `- <t:${Math.floor(
                i.start.getTime() / 1000
              )}:t> to <t:${Math.floor(i.end.getTime() / 1000)}:t> - ${i.title}`
        );
      await interaction.editReply({
        content: `Here are Naomi's events for the next 24 hours:\n${eventList.join(
          "\n"
        )}`
      });
    } catch (err) {
      await errorHandler(bot, "calendar command", err);
      await interaction.editReply({
        content:
          "Forgive me, but I failed to complete your request. Please try again later."
      });
    }
  }
};
