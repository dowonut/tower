import { game, prisma } from "../../tower.js";

/** Add or increase a passive modifier. */
export default (async function (args: {
  source?: string;
  name?: string;
  target?: string;
  value: number;
  modifier: string;
  duration?: number;
}) {
  let {
    source = "skill",
    name = "all",
    target = "damage",
    value,
    modifier,
    duration,
  } = args;

  const dataObject = {
    playerId: this.id,
    source: source,
    name: name,
    target: target,
    modifier: modifier,
    duration: duration,
  };

  const filteredPassive = await prisma.passive.findMany({
    where: dataObject,
  });

  // If passive doesn't exist, create a new entry
  if (!filteredPassive[0]) {
    // Create new passive
    await prisma.passive.create({
      data: { ...dataObject, value: value },
    });
  }
  // If passive already exists, then update
  else {
    // Update the passive value
    await prisma.passive.updateMany({
      where: {
        id: filteredPassive[0].id,
      },
      data: {
        value: { increment: value },
      },
    });
  }
} satisfies PlayerFunction);
