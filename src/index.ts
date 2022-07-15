import { ChatClient } from "@twurple/chat";
import chalk from "chalk";
import dotenv from "dotenv";
import getTwitchCommands from "./lib/get-twitch-commands";
import setupDiscordBot from "./lib/setup-discord-bot";
import setupSpotify from "./lib/setup-spotify-user";
import setupTwitchBot from "./lib/setup-twitch-bot";
import deployTwitchUser from "./lib/setup-twitch-user";
import SpotifyClient from "./lib/spotify-client";

dotenv.config();

export interface CommandArgs {
  args: string[];
  commands: Record<string, any>;
  config: Config;
  lurkers: Record<string, string>;
  spotifyUserClient: SpotifyClient;
  twitchBotClient: ChatClient;
  user: string;
}

export interface Config extends Record<string, any> {}

// Manual config
const config: Config = {
  bot: chalk.hex("#7b61ff")("🤖 ljtechbotca"),
  card: "https://i.imgur.com/TN5fDNl.png",
  channel: "ljtechdotca",
  discordInvite: "https://discord.com/invite/F6nDGk5HKU",
  vscodeSettings:
    "https://gist.github.com/ljtechdotca/b2c38e16dbef82f51c7282eef18d0b91",
  discordChannelId: "815879442337366036",
  figma: "https://www.figma.com/@ljtech",
  github: "https://github.com/ljtechdotca",
  linkedin: "https://www.linkedin.com/in/ljtechdotca",
  twitch: "https://www.twitch.tv/ljtechdotca",
  twitter: "https://twitter.com/ljtechdotca",
  website: "https://ljtech.ca",
};

async function main() {
  const commands = getTwitchCommands();

  const discordTextChannel = await setupDiscordBot(config);

  const spotifyUserClient = setupSpotify();

  const twitchBotClient = await setupTwitchBot(
    config,
    commands,
    spotifyUserClient
  );

  deployTwitchUser(config, discordTextChannel, twitchBotClient);
}

main();
