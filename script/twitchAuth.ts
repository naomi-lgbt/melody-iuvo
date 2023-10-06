import { config } from "dotenv";
config();

console.log(`Follow this URL to get an access token. Pull teh access token from the redirect URL and add it to the env file.

${encodeURI(
  `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.TWITCH_CLIENT_ID}&redirect_uri=http://localhost:3000&response_type=token`
)}
`);
