import { game, prisma } from "../../tower.js";
import attacks from "../../game/_classes/attacks.js";

export default (async function (attackName: string) {
  const attackData = await prisma.attack.findMany({
    where: {
      playerId: this.id,
      name: { equals: attackName, mode: "insensitive" },
    },
  });

  if (attackData.length < 1 || !attackData[0]) return;

  const attackClass = attacks.find((x) => x.name == attackName.toLowerCase());

  const finalAttack = game.createClassObject<Attack>(attackClass, attackData);

  return finalAttack;
} satisfies PlayerFunction);
