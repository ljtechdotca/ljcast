import { RefreshingAuthProvider } from "@twurple/auth";
import { ChatClient } from "@twurple/chat";
import chalk from "chalk";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { Config } from "..";
import getTimestamp from "./get-timestamp";
import isValidCommand from "./is-valid-command";

dotenv.config();

const initialToken = JSON.parse(
  fs.readFileSync(
    path.resolve(".", "data", "tokens", "twitch-bot.json"),
    "utf-8"
  )
);

let lurkers: Record<string, string> = {};

async function setupTwitchBot(
  config: Config,
  commands: Record<string, any>,
  spotifyUserClient: any
) {
  const authProvider = new RefreshingAuthProvider(
    {
      clientId: process.env.TWITCH_BOT_CLIENT_ID as string,
      clientSecret: process.env.TWITCH_BOT_CLIENT_SECRET as string,
      onRefresh: async (newTokenData) =>
        fs.writeFileSync(
          path.resolve(".", "data", "tokens", "twitch-bot.json"),
          JSON.stringify(newTokenData, null, 4),
          "utf-8"
        ),
    },
    {
      accessToken: initialToken.accessToken,
      refreshToken: initialToken.refresh_token,
      expiresIn: initialToken.expires_in,
      obtainmentTimestamp: Math.floor(new Date().getTime() / 1000),
    }
  );

  const twitchBotClient = new ChatClient({
    authProvider: authProvider,
    channels: [config.channel],
    logger: {
      minLevel: 0,
    },
  });

  await twitchBotClient.connect();

  twitchBotClient.onMessage(async (channel, user, message, msg) => {
    const timestamp = getTimestamp();
    const color = msg.userInfo.color ? msg.userInfo.color : "#ff0000";
    const userName = chalk.hex(color)(user);
    const isCommand = isValidCommand(commands, message);
    const isHighlighted = msg.tags.get("msg-id") === "highlighted-message";
    let result;

    if (
      (!isCommand && lurkers[user]) ||
      (isCommand && isCommand.name !== "lurk" && lurkers[user])
    ) {
      result = await commands.unlurk.execute({
        args: [],
        commands,
        config,
        lurkers,
        spotifyUserClient,
        twitchBotClient,
        user,
      });

      result = chalk.grey(result);

      console.log(timestamp + " " + result);
    }

    if (isCommand) {
      result = await commands[isCommand.name].execute({
        args: isCommand.args,
        commands,
        config,
        lurkers,
        spotifyUserClient,
        twitchBotClient,
        user,
      });
      result = chalk.grey(result);

      console.log(timestamp + " " + userName + ": " + message);
      console.log(timestamp + " " + result);
    } else if (isHighlighted) {
      console.log(
        timestamp + " " + userName + ": " + chalk.bgHex("#755ebc")(message)
      );
    } else {
      console.log(timestamp + " " + userName + ": " + message);
    }
  });

  twitchBotClient.onSub((channel, user) => {
    const timestamp = getTimestamp();
    const message = `Thanks to @${user} for subscribing to the channel!`;
    twitchBotClient.say(channel, message);
    console.log(timestamp + " " + config.bot + ": " + message);
  });

  twitchBotClient.onResub((channel, user, subInfo) => {
    const timestamp = getTimestamp();
    const message = `Thanks to @${user} for subscribing to the channel for a total of ${subInfo.months} months!`;
    twitchBotClient.say(channel, message);
    console.log(timestamp + " " + config.bot + ": " + message);
  });

  twitchBotClient.onSubGift((channel, user, subInfo) => {
    const timestamp = getTimestamp();
    const message = `Thanks to ${subInfo.gifter} for gifting a subscription to ${user}!`;
    twitchBotClient.say(channel, message);
    console.log(timestamp + " " + config.bot + ": " + message);
  });

  return twitchBotClient;
}

export default setupTwitchBot;
