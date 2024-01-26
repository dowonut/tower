import { game, prisma } from "../../tower.js";

import * as classes from "../../game/_classes/index.js";

type Model = keyof typeof prisma;

export default (async function <T, A extends string = undefined>(args: {
  key: Model;
  name?: A;
  filter?: (x: Item) => boolean;
  sort?: string;
}): Promise<A extends undefined ? T[] : T> {
  let { key, name, filter, sort = "name" } = args;
  let array: T[] = [];
  let items: any[] = [];
  let keyS = key.toString();

  // Get all items
  items = await prisma[key as string].findMany({
    where: { playerId: this.id },
    orderBy: [{ [sort]: "desc" }],
  });

  if (!items[0]) return; //throw new Error("No items found using key: " + keyS);

  // If name
  if (name && !filter) {
    filter = (x) => x.name == name.toLowerCase();
  }

  // Filter items
  if (filter) {
    items = items.filter(filter);
  }

  // Return if no items
  if (items.length < 1 || !items[0]) return undefined as any;

  // Create all item instances from their classes
  for (const item of items) {
    const itemClass = classes[keyS + "s"].find((x) => x.name == item.name);

    if (!itemClass) throw new Error("No class found with name: " + keyS + "s");
    const finalItem = game.createClassObject<T>(itemClass, item);

    array.push(finalItem);
  }

  if (array.length > 0) {
    return array as any;
  } else {
    return undefined as any;
  }
} satisfies PlayerFunction);
