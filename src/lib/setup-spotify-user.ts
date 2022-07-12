import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import SpotifyClient from "./spotify-client";

dotenv.config();

const initialToken = JSON.parse(
  fs.readFileSync(
    path.resolve(".", "data", "tokens", "spotify-user.json"),
    "utf-8"
  )
);

function setupSpotify() {
  const spotifyUser = new SpotifyClient(
    {
      clientId: process.env.SPOTIFY_USER_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_USER_CLIENT_SECRET as string,
    },
    initialToken
  );

  return spotifyUser;
}

export default setupSpotify;
