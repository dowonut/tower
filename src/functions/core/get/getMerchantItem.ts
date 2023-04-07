import { game } from "../../../tower.js";

/** Get specific merchant item. */
export default async function getMerchantItem(
  itemName: string,
  player: Player
) {
  const items = await game.getMerchantItems(player);

  const item = items.find((x) => x.name == itemName);

  if (!item) return;
  return item;
}
