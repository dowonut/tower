import { game, config, prisma } from "../../tower.js";

/** Check for missing default values and patch them. */
export default (async function () {
  const entries = config.playerDefaultEntries;

  let patches: string[] = [];

  for (const [key, value] of Object.entries(entries)) {
    const entryArr = value.map((x) => ({ playerId: this.id, name: x }));

    const results = await prisma[key].findMany({ where: { OR: entryArr } });
    entryArr.forEach(async (x) => {
      if (!results.some((y) => y.name == x.name)) {
        patches.push(`${key}: ${x.name}`);
        await prisma[key].create({ data: x });
      }
    });
  }

  return patches;
} satisfies PlayerFunction);
