import { game } from "../../tower.js";

/**
 * Get item by name.
 */
export default (async function (name: string) {
  const items = await this.getItems({
    filter: (x) => {
      return x.name == name;
    },
  });

  if (items) return items[0];
} satisfies PlayerFunction);
