import { performance } from "node:perf_hooks";
import { CommandArgs } from "..";

module.exports = {
  data: {
    name: "dice",
    description: "Rolls a 6-sided die.",
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
    let sides = 6;

    const option = Number(args[0]);

    if (option > 1 && Number.isFinite(option)) {
      sides = option;
    }

    const result = Math.floor(Math.random() * sides) + 1;

    const message = `${user} has rolled a ${sides}-sided die and got ${result}.`;

    await twitchBotClient.say(config.channel, message);

    this.data.lastUsed = performance.now();

    return message;
  },
};
