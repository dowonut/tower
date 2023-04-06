import { prisma, config } from "../../tower.js";
import tutorials from "../../game/_classes/tutorials.js";

export default (async function (message: Message, commandNames: string[]) {
  let tutorialRefs = [];
  for (const commandName of commandNames) {
    if (!this.user.unlockedCommands.includes(commandName)) {
      await prisma.user.update({
        where: { id: this.userId },
        data: {
          unlockedCommands: { push: commandName },
        },
      });
    } else {
      continue;
    }

    // const tutorial = tutorials.find((x) => x.name == commandName.toLowerCase());

    // if (tutorial) {
    //   tutorialRefs.push(tutorial);
    // } else {
    //   tutorialRefs.push({ name: commandName });
    // }
  }

  if (tutorialRefs.length < 1) return;

  const infos = tutorialRefs.map((x) => {
    let info = ``;
    info += `\n\n${config.emojis.bullet} **${x.name.toUpperCase()}**`;
    if (x.info) {
      info += `${x.info}`;
    } else {
      info += ``;
    }
    return info;
  });

  const nameText = `New Commands Unlocked!`;
  const description = infos.join("");

  const embed = {
    title: nameText,
    color: config.towerColor,
    description: description,
  };

  return message.author.send({ embeds: [embed] });
} satisfies PlayerFunction);
