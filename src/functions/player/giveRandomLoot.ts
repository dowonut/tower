import { game } from "../../tower.js";

export default (async function (message: Message, server: Server) {
  // Fetch region and format region name
  const region = this.getRegion();
  const regionName = game.titleCase(region.name);

  // Fetch item from weights
  let item = game.getWeightedArray(region.loot);
  const itemName = game.titleCase(item.name);
  item = { ...item, ...game.getItem(item.name) };
  const itemEmoji = item.getEmoji();

  // Determine item quantity
  const itemQuantity = item.min ? game.random(item.min, item.max) : 1;

  // Give item to player
  await this.giveItem(item.name, itemQuantity);

  // Format quantity text
  let quantityText = itemQuantity > 1 ? `\`${itemQuantity}x\` ` : ``;

  // Unlock region loot
  this.addExplore(message, server, "loot", undefined, item.name);

  // Send message to player
  return await game.reply(
    message,
    `you explore the **${regionName}** and find ${quantityText}**${itemName}** ${itemEmoji}`
  );
} satisfies PlayerFunction);
