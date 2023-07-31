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

  // Get all items
  items = await prisma[key as string].findMany({
    where: { playerId: this.id },
    orderBy: [{ [sort]: "desc" }],
  });

  if (!items[0]) throw new Error("No items found using key: " + key);

  // If name
  if (name && !filter) {
    filter = (x) => x.name == name.toLowerCase();
  }

  // Filter items
  if (filter) {
    items = items.filter(filter);
  }

  // Return if no items
  if (items.length < 1 || !items[0]) return;

  // Create all item instances from their classes
  for (const item of items) {
    const itemClass = classes[key + "s"];

    if (!itemClass) throw new Error("No class found with name: " + key + "s");
    const finalItem = game.createClassObject<T>(itemClass, item);

    array.push(finalItem);
  }

  if (array.length > 1) {
    return array as any;
  } else {
    return array[0] as any;
  }
} satisfies PlayerFunction);
