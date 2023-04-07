import fs from "fs";
import path from "path";

/** Get all commands and return array. */
export default async function getCommands() {
  let allCommands: Command[] = [];
  let commandFiles = [];

  function throughDirectory(directory: any, array: string[]) {
    fs.readdirSync(directory).forEach((file) => {
      const absolute = path.join(directory, file);
      if (fs.statSync(absolute).isDirectory())
        return throughDirectory(absolute, array);
      else return array.push(absolute);
    });
  }
  throughDirectory("./src/commands", commandFiles);

  for (const file of commandFiles) {
    if (!file.endsWith(".ts")) continue;
    const { default: command } = await import(`../../../../${file}`);
    allCommands.push(command);
  }

  return allCommands;
}
