import { game } from "../../tower.js";

export default (async function () {
  // Fetch region and format region name
  const region = this.getRegion();
  const regionName = game.titleCase(region.name);

  // Fetch item from weights
  let regionItem: RegionLoot = game.getWeightedArray(region.loot);
  const itemName = game.titleCase(regionItem.name);
  const item = game.getItem(itemName);
  const itemEmoji = item.getEmoji();

  // Determine item quantity
  const itemQuantity = regionItem.min ? game.random(regionItem.min, regionItem.max) : 1;

  // Give item to player
  await this.giveItem(item.name, itemQuantity);

  // Format quantity text
  let quantityText = itemQuantity > 1 ? `\`${itemQuantity}x\` ` : ``;

  // Unlock region loot
  this.addExploration({ type: "loot", name: item.name });

  // Send message to player
  return await game.send({
    player: this,
    reply: true,
    content: `you explore the **${regionName}** and find ${quantityText}**${itemName}** ${itemEmoji}`,
  });
} satisfies PlayerFunction);
