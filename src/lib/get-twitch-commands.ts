import fs from "fs";
import path from "path";

function getTwitchCommands() {
  const commandsPath = path.resolve(".", "build", "commands");
  const commandNames = fs.readdirSync(commandsPath);
  let commands: Record<string, any> = {};

  for (const commandName of commandNames) {
    const key = commandName.split(".")[0];
    const command = require(`../commands/${key}`);
    commands = { ...commands, [key]: command };
  }

  return commands;
}

export default getTwitchCommands;
