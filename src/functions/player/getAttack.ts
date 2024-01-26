import { game, prisma } from "../../tower.js";
import attacks from "../../game/_classes/attacks.js";

export default (async function (attackName: string) {
  attackName = attackName.toLowerCase();
  const attackData = await prisma.attack.findUnique({
    where: {
      playerId_name: {
        playerId: this.id,
        name: attackName,
      },
    },
  });

  if (!attackData) return;

  const attackClass = attacks.find((x) => x.name == attackName);

  if (!attackClass) return;

  const finalAttack = game.createClassObject<Attack>(attackClass, attackData);

  return finalAttack;
} satisfies PlayerFunction);
