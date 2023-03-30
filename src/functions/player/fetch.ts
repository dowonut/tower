import { game, prisma } from "../../tower.js";

import * as classes from "../../game/_classes/index.js";

export default (async function <T>(key: string, name: string) {
  let array: T[] = [];
  let items: any[] = [];

  // Get specific item by name
  if (name) {
    items = await prisma[key].findMany({
      //orderBy: [{ level: "desc" }, { xp: "desc" }],
      where: {
        playerId: this.id,
        name: { equals: name, mode: "insensitive" },
      },
    });

    if (!items[0]) throw new Error("No item found by name " + name);
  }
  // Get all items by key
  else {
    items = await prisma[key].findMany({
      //orderBy: [{ level: "desc" }, { xp: "desc" }],
      where: { playerId: this.id },
    });
  }

  // Create all item instances from their classes
  for (const item of items) {
    const itemClass = classes[key + "s"];

    if (!itemClass) throw new Error("No class found by name " + key + "s");
    const finalItem = game.createClassObject<T>(itemClass, item);

    array.push(finalItem);
  }

  if (array.length > 1) {
    return array;
  } else {
    return array[0];
  }
} satisfies PlayerFunction);
