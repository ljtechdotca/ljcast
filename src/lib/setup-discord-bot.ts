import { Client, Intents, TextChannel } from "discord.js";
import dotenv from "dotenv";
import { Config } from "..";

dotenv.config();

async function setupDiscordBot(config: Config) {
  const discordBot = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.GUILD_VOICE_STATES,
    ],
  });

  await discordBot.login(process.env.DISCORD_BOT_TOKEN);

  const textChannel = (await discordBot.channels.fetch(
    config.discordChannelId
  )) as TextChannel;

  return textChannel;
}

export default setupDiscordBot;
