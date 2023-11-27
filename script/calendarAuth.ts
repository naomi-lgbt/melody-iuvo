import { authenticate } from "@google-cloud/local-auth";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";

const scopes = ["https://www.googleapis.com/auth/calendar.readonly"];
const tokenPath = join(process.cwd(), "calendar", "token.json");
const credPath = join(process.cwd(), "calendar", "credentials.json");

(async () => {
  console.log("Please check your browser to auth to the app.");
  const client = await authenticate({
    scopes,
    keyfilePath: credPath
  });
  if (client.credentials) {
    const content = await readFile(credPath, "utf-8");
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      type: "authorized_user",
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token
    });
    await writeFile(tokenPath, payload, "utf-8");
    console.log("Authentication complete. App should be ready to use!");
  }
})();
