import { game, prisma, config } from "../../tower.js";

import attacks from "../../game/_classes/attacks.js";

/** Get available attacks based on currently equipped weapon. */
export default (async function () {
  const playerAttacks = await prisma.attack.findMany({
    orderBy: [{ remCooldown: "asc" }],
    where: { playerId: this.id },
  });

  let attackArray: Attack[] = [];

  for (const playerAttack of playerAttacks) {
    const attackClass = attacks.find(
      (x) => x.name == playerAttack.name.toLowerCase()
    );

    if (!attackClass) continue;

    const attack = game.createClassObject<Attack>(attackClass, playerAttack);

    attackArray.push(attack);
  }

  let finalArray: Attack[];

  if (this.hand) {
    const item = await this.getItem(this.hand);
    finalArray = attackArray.filter((x) =>
      x.weaponType.includes(item.weaponType)
    );
  } else {
    finalArray = attackArray.filter((x) => x.weaponType.includes("unarmed"));
  }

  return finalArray;
} satisfies PlayerFunction);
