import { game, prisma, config } from "../../tower.js";

import attacks from "../../game/_classes/attacks.js";

/** Get all player attacks */
export default (async function (args?: {
  /** Only get attacks that are currently usable. */
  onlyAvailable: boolean;
}) {
  const skills = await this.getSkills();

  // Get unlocked attacks from skills
  let unlockedAttacks: string[] = [];
  for (const skill of skills) {
    const rewards = skill.levels
      .slice(0, skill.level + 1)
      .map((x) => x.rewards)
      .flat();

    for (const reward of rewards) {
      if (reward.type == "unlockAttack") unlockedAttacks.push(reward.attack);
    }
  }

  // Get or create attacks
  let attacks: Attack[] = [];
  for (const attackName of unlockedAttacks) {
    let attack = await this.getAttack(attackName);
    if (!attack) {
      await prisma.attack.create({
        data: { playerId: this.id, name: attackName },
      });
      attack = await this.getAttack(attackName);
    }
    attacks.push(attack);
  }

  return attacks;
} satisfies PlayerFunction);
