import dungeons from "../../game/_classes/dungeons.js";
import { game, prisma } from "../../tower.js";

/** Get the player's current dungeon. */
export default (async function () {
  const dungeonData = await prisma.dungeon.findFirst({
    where: {
      players: { some: { id: this.id } },
    },
  });

  if (!dungeonData) return;

  const dungeonClass = dungeons.find((x) => x.name == dungeonData.name.toLowerCase());

  if (!dungeonClass) return;

  const finalDungeon = game.createClassObject<Dungeon>(dungeonClass, dungeonData);
  return finalDungeon;
} satisfies PlayerFunction);
