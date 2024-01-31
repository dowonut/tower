import { prisma, config, game } from "../../tower.js";
import tutorials from "../../game/_classes/tutorials.js";

export default (async function (commandNames: string[]) {
  const allCommands = await game.getCommands();

  let newCommands: Command[] = [];
  for (const commandName of commandNames) {
    if (!this.user.unlockedCommands.includes(commandName)) {
      await prisma.user.update({
        where: { id: this.userId },
        data: {
          unlockedCommands: { push: commandName },
        },
      });
      const newCommand = allCommands.find((x) => x.name == commandName);
      newCommands.push(newCommand);
    } else {
      continue;
    }
  }

  // Send tutorial and unlock messages
  for (const newCommand of newCommands) {
    const title = `*New command unlocked: **\`-${newCommand.name}\`***`;
    let description = newCommand?.tutorial?.content
      ? newCommand.tutorial.content
      : newCommand.description;

    const botMessage = await game.send({
      player: this,
      content: title + "\n" + description,
      reply: false,
    });

    if (newCommand?.tutorial?.buttons)
      game.commandButton({ commands: newCommand.tutorial.buttons, botMessage, player: this });
  }
} satisfies PlayerFunction);
