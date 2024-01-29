import { game, prisma, config } from "../../tower.js";

import attacks from "../../game/_classes/actions.js";

/** Get all player attacks */
export default (async function (args: {
  /** Filter by type of action. */
  type: ActionType;
  /** Only get attacks that are currently usable. */
  onlyAvailable?: boolean;
  /** Optionally get attack by name. */
  name?: string;
}) {
  const { onlyAvailable, name, type } = args;

  if (type == "weapon_attack") {
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
    let attacks: Action[] = [];
    for (const attackName of unlockedAttacks) {
      let attack = await this.getAction(attackName);
      if (!attack) {
        await prisma.action.create({
          data: { playerId: this.id, name: attackName },
        });
        attack = await this.getAction(attackName);
      }
      attacks.push(attack);
    }

    // Check if attack is currently available
    if (onlyAvailable) {
      const weapon = (await this.getEquipped("hand"))?.weaponType || "unarmed";
      attacks = attacks.filter((x) => x.requiredWeapon.includes(weapon));
    }

    // Filter by name
    if (name) {
      attacks = attacks.filter((x) => x.name == name.toLowerCase());
    }

    return attacks;
  }
} satisfies PlayerFunction);
