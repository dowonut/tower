import emojis from "../../emojis.js";
import { game } from "../../tower.js";

export default {
  name: "statuseffectinfo",
  aliases: ["sei", "statusinfo", "effectinfo"],
  description: "View information about a specific status effect.",
  category: "combat",
  arguments: [{ name: "status_effect", type: "statusEffect" }],
  useInCombat: true,
  useInDungeon: true,
  async execute(message, args: { status_effect: StatusEffect }, player, server) {
    const { status_effect: statusEffect } = args;

    const title = `${emojis[statusEffect.type]}${game.titleCase(statusEffect.name)}`;
    const effectDescription = `*${statusEffect.description}*`;
    const effectInfo = statusEffect.getInfo();

    const description = `${effectDescription}\n\n${effectInfo}`;

    game.fastEmbed({ player, title, description, reply: true });
  },
} satisfies Command;
