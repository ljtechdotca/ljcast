import { performance } from "node:perf_hooks";
import { CommandArgs } from "..";

module.exports = {
  data: {
    name: "discord",
    description: "Links the official ljtechdotca Discord server.",
    lastUsed: 0,
    public: true,
  },
  execute: async function ({
    args,
    config,
    commands,
    spotifyUserClient,
    twitchBotClient,
    user,
  }: CommandArgs) {
    const message =
      `🎉 Join my Discord server: ${config.discordInvite}`;

    await twitchBotClient.say(config.channel, message);

    this.data.lastUsed = performance.now();

    return message;
  },
};
