import { RefreshingAuthProvider } from "@twurple/auth";
import { ChatClient } from "@twurple/chat";
import { BasicPubSubClient, PubSubClient } from "@twurple/pubsub";
import chalk from "chalk";
import { MessageEmbed, TextChannel } from "discord.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { Config } from "..";
import getTimestamp from "./get-timestamp";

dotenv.config();

const initialToken = JSON.parse(
  fs.readFileSync(
    path.resolve(".", "data", "tokens", "twitch-user.json"),
    "utf-8"
  )
);

async function deployTwitchUser(
  config: Config,
  textChannel: TextChannel,
  twitchBotClient: ChatClient
) {
  const authProvider = new RefreshingAuthProvider(
    {
      clientId: process.env.TWITCH_USER_CLIENT_ID as string,
      clientSecret: process.env.TWITCH_USER_CLIENT_SECRET as string,
      onRefresh: async ({
        accessToken,
        refreshToken,
        expiresIn,
        obtainmentTimestamp,
      }) =>
        fs.writeFileSync(
          path.resolve(".", "data", "tokens", "twitch-user.json"),
          JSON.stringify(
            {
              access_token: accessToken,
              refresh_token: refreshToken,
              expires_in: expiresIn,
              obtainment_timestamp: obtainmentTimestamp,
            },
            null,
            4
          ),
          "utf-8"
        ),
    },
    {
      accessToken: initialToken.access_token,
      refreshToken: initialToken.refresh_token,
      expiresIn: initialToken.expires_in,
      obtainmentTimestamp: initialToken.obtainment_timestamp,
    }
  );

  const pubSubClient = new PubSubClient(
    new BasicPubSubClient({
      logger: {
        minLevel: 0,
      },
    })
  );

  const user = await pubSubClient.registerUserListener(authProvider);

  pubSubClient.onCustomTopic(
    user,
    "video-playback-by-id",
    ({ data }: any) => {
      const { type } = data;

      if (type == "stream-up") {
        textChannel.send({
          content: `Hey @here, ${config.channel} just went live on Twitch.tv!`,
          embeds: [
            new MessageEmbed()
              .setColor("DEFAULT")
              .setTitle(`${config.channel} is LIVE`)
              .setDescription("Come hang out and vibe.")
              .setTimestamp()
              .setImage(config.card)
              .setURL(config.twitch),
          ],
        });
      }
    },
    ""
  );

  pubSubClient.onCustomTopic(
    user,
    "following",
    ({ data }: any) => {
      const timestamp = getTimestamp();
      const user = data["display_name"];
      const message = `Thanks @${user} for the follow!`;

      twitchBotClient.say(config.channel, message);

      console.log(timestamp + " " + config.bot + ": " + message);
    },
    "user:read:follows"
  );

  pubSubClient.onRedemption(user, ({ rewardTitle, rewardCost, userName }) => {
    const timestamp = getTimestamp();
    const message = chalk.grey(
      `${userName} redeemed ${rewardTitle} 💎 ${rewardCost} `
    );

    console.log(timestamp + " " + message);
  });

  pubSubClient.onBits(user, ({ bits, userName }) => {
    const timestamp = getTimestamp();
    let user = "Anonymous";
    const message = `Thanks @${user} for cheering ${bits} bits!`;

    if (userName) {
      user = userName;
    }

    twitchBotClient.say(config.channel, message);

    console.log(timestamp + " " + config.bot + ": " + message);
  });
}

export default deployTwitchUser;
