import { game } from "../../tower.js";

export default {
  name: "entercombat",
  description: "",
  category: "admin",
  arguments: [
    { name: "enemy1", required: false },
    { name: "enemy2", required: false },
    { name: "enemy3", required: false },
    { name: "enemy4", required: false },
  ],
  dev: true,
  async execute(message, args: { enemy1: string; enemy2: string; enemy3: string; enemy4: string }, player, server) {
    const { enemy1 = "small slime", enemy2, enemy3, enemy4 } = args;
    const enemyNames = [enemy1, enemy2, enemy3, enemy4];

    let enemies: Enemy[] = [];
    for (const name of enemyNames) {
      if (name) {
        enemies.push(game.getEnemy(name));
      } else {
        continue;
      }
    }

    game.enterCombat({ player, enemies: enemies });
  },
} satisfies Command;
