import { game } from "../../tower.js";

export default {
  name: "entercombat",
  description: "",
  category: "admin",
  arguments: [{ name: "enemy", required: false }],
  dev: true,
  async execute(message, args, player, server) {
    const enemyName = args.enemy || "small slime";
    const enemy = game.getEnemy(enemyName);

    game.enterCombat({ player, enemies: [enemy] });
  },
} satisfies Command;
