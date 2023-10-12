import { createHmac, timingSafeEqual } from "crypto";
import { readFile } from "fs/promises";
import http from "http";
import https from "https";

import { Octokit } from "@octokit/rest";
import express from "express";

import { FirstTimer, IgnoredActors, ThankYou } from "../config/Github";
import { ExtendedClient } from "../interfaces/ExtendedClient";
import { errorHandler } from "../utils/errorHandler";

/**
 * Instantiates the web server for GitHub webhooks.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 */
export const serve = async (bot: ExtendedClient) => {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  const token = process.env.GITHUB_TOKEN;
  if (!secret || !token) {
    await bot.env.debugHook.send(
      "No GitHub webhook secret provided.  Web server will not be started."
    );
    return;
  }
  const app = express();
  app.use(express.json());

  // mount your middleware and routes here

  app.get("/", (req, res) => {
    res.send("Melody online!");
  });

  app.post("/github", async (req, res) => {
    try {
      const header = req.headers["x-hub-signature-256"];
      if (!header || Array.isArray(header)) {
        await bot.env.debugHook.send(
          "Received request with no signature.\n\n" +
            JSON.stringify(req.body).slice(0, 2000)
        );
        res.status(403).send("No valid signature present.");
        return;
      }
      const signature = createHmac("sha256", secret)
        .update(JSON.stringify(req.body))
        .digest("hex");
      const trusted = Buffer.from(`sha256=${signature}`, "ascii");
      const sent = Buffer.from(header, "ascii");
      const safe = timingSafeEqual(trusted, sent);
      if (!safe) {
        await bot.env.debugHook.send(
          "Received request with bad signature.\n\n" +
            JSON.stringify(req.body).slice(0, 2000)
        );
        res.status(403).send("Signature is not correct.");
        return;
      }
      res.status(200).send("Signature is correct.");

      const event = req.headers["x-github-event"];
      if (event === "sponsorship" && req.body.action === "created") {
        await bot.general.send({
          content: `## Big thanks to ${req.body.sponsorship.sponsor.login} for sponsoring us on GitHub!\n\nTo claim your sponsor role, please make sure your GitHub account is connected to your Discord account, then ping Mama Naomi for your role!`,
        });
      }
      if (event !== "pull_request") {
        return;
      }

      if (IgnoredActors.includes(req.body.pull_request.user.login)) {
        return;
      }

      const owner = req.body.repository.owner.login;
      const repo = req.body.repository.name;
      const number = req.body.number;
      const isFirstTimer =
        req.body.action === "opened" &&
        (req.body.author_association === "FIRST_TIMER" ||
          req.body.author_association === "FIRST_TIME_CONTRIBUTOR");
      const isMerged =
        req.body.action === "closed" && req.body.pull_request.merged;
      const github = new Octokit({
        auth: process.env.GITHUB_TOKEN,
      });
      if (isFirstTimer) {
        await github.issues.createComment({
          owner,
          repo,
          issue_number: number,
          body: FirstTimer,
        });
      }
      if (isMerged) {
        await github.issues.createComment({
          owner,
          repo,
          issue_number: number,
          body: ThankYou,
        });
      }
    } catch (err) {
      await errorHandler(bot, "github webhook", err);
    }
  });

  const httpServer = http.createServer(app);

  httpServer.listen(9080, async () => {
    await bot.env.debugHook.send("http server listening on port 9080");
  });

  if (process.env.NODE_ENV === "production") {
    const privateKey = await readFile(
      "/etc/letsencrypt/live/melody.naomi.lgbt/privkey.pem",
      "utf8"
    );
    const certificate = await readFile(
      "/etc/letsencrypt/live/melody.naomi.lgbt/cert.pem",
      "utf8"
    );
    const ca = await readFile(
      "/etc/letsencrypt/live/melody.naomi.lgbt/chain.pem",
      "utf8"
    );

    const credentials = {
      key: privateKey,
      cert: certificate,
      ca: ca,
    };

    const httpsServer = https.createServer(credentials, app);

    httpsServer.listen(9443, async () => {
      await bot.env.debugHook.send("https server listening on port 9443");
    });
  }
};
