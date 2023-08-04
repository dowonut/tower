import { game } from "../../../tower.js";
import * as classes from "../../../game/_classes/index.js";

type Model = keyof Omit<typeof classes, "generic" | "players" | "tutorials">;

/** Get many of something. */
export default function getMany(key: Model, args?: { name?: string; max?: number }) {
  let { name, max } = args;
  name = name.toLowerCase();

  let itemClass: (typeof classes)[typeof key][number][] = classes[key];

  if (name) {
    itemClass = itemClass.filter((x) => {
      return "name" in x && x.name == name;
    });
  }

  if (max) itemClass = itemClass.slice(0, max - 1);

  return itemClass;
}
