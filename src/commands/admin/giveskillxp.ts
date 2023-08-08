import { game, config, client, prisma } from "../../tower.js";

export default {
  name: "giveskillxp",
  aliases: ["gsx"],
  arguments: [
    { name: "player", required: true, type: "user" },
    {
      name: "skill",
      required: true,
      filter(i, p) {
        const skill = game.getMany("skills", { name: i });
        if (skill.length > 0) {
          return { success: true, content: skill[0] };
        } else {
          return { success: false, message: `No skill found by name ${game.f(i)}` };
        }
      },
    },
    {
      name: "amount",
      required: false,
      type: "strictNumber",
    },
  ],
  description: "Give xp to a player.",
  category: "admin",
  async execute(message, args: { player: Player; skill: Skill; amount: number }, player, server) {
    player = args.player;

    await player.giveSkillXP({ skillName: args.skill.name, amount: args.amount, message });

    game.send({
      message,
      reply: true,
      content: `Gave ${game.f(args.amount + ` XP`)} to ${player.ping}'s **${args.skill.getName()}** skill.`,
    });
  },
} satisfies Command;
