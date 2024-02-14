import emojis from "../../emojis.js";
import { game } from "../../tower.js";

export default {
  name: "statuseffectinfo",
  aliases: ["sei", "statusinfo", "effectinfo"],
  description: "View information about a specific status effect.",
  category: "combat",
  arguments: [
    { name: "status_effect", type: "statusEffect" },
    { name: "level", required: false, type: "strictNumberZero" },
  ],
  useInCombat: true,
  useInDungeon: true,
  async execute(message, args: { status_effect: StatusEffect; level: number }, player, server) {
    const { status_effect: statusEffect, level } = args;
    Object.assign(statusEffect, { level: Math.min(level, 10) });

    let levelText = statusEffect.level > 0 ? ` \`+${statusEffect.level}\`` : ``;
    const title = `${emojis[statusEffect.type]}${game.titleCase(statusEffect.name)}${levelText}`;
    const effectDescription = `*${statusEffect.description}*`;
    const effectInfo = statusEffect.getInfo();

    const description = `${effectDescription}\n\n${effectInfo}`;

    game.fastEmbed({ player, title, description, reply: true });
  },
} satisfies Command;
