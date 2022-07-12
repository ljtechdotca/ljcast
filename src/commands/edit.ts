import fs from "fs";
import { performance } from "node:perf_hooks";
import { resolve } from "path";
import { CommandArgs } from "..";

const todayPath = resolve(".", "data", "today.txt");

module.exports = {
  data: {
    name: "edit",
    description: "Updates the !today notification content.",
    lastUsed: 0,
    public: false,
  },
  execute: async function ({
    args,
    config,
    commands,
    spotifyUserClient,
    twitchBotClient,
    user,
  }: CommandArgs) {
    fs.writeFileSync(todayPath, args.join(" "));

    const message = "Today has been updated!";

    await twitchBotClient.say(config.channel, message);

    this.data.lastUsed = performance.now();

    return message;
  },
};
