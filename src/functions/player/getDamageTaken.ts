import { game } from "../../tower.js";

export default (async function (attack: EnemyEvaluatedAttack) {
  // Calculate defence
  const defenceMultiplier = 1 - this.defence / 100;

  let total = 0;
  for (let attackDamage of attack.damage.damages) {
    // Choose base damage randomly
    const baseDamage = game.random(attackDamage.min, attackDamage.max);

    // Calculate final damage
    const damage = Math.ceil(baseDamage * defenceMultiplier);

    attackDamage.final = damage;
    total += damage;
  }
  attack.damage.total = total;

  return attack;
} satisfies PlayerFunction);
