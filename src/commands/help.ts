import { performance } from "node:perf_hooks";
import { CommandArgs } from "..";

module.exports = {
  data: {
    name: "help",
    description: "Use !help command-name for command information.",
    lastUsed: 0,
    public: true,
  },
  lastUsed: 0,
  execute: async function ({
    args,
    config,
    commands,
    spotifyUserClient,
    twitchBotClient,
    user,
  }: CommandArgs) {
    const option = args[0];

    let message = this.data.description;

    if (commands[option]) {
      message = commands[option].data.description;
    }

    await twitchBotClient.say(config.channel, message);

    this.data.lastUsed = performance.now();

    return message;
  },
};
