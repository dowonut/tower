import { game, prisma } from "../../tower.js";

/** Get unlocked merchants on current floor. */
export default (async function () {
  const merchantsRef = await prisma.exploration.findMany({
    where: { playerId: this.id, floor: this.floor, type: "merchant" },
  });

  if (!merchantsRef[0]) return [];

  let merchantArr: Merchant[] = [];
  for (const merchantRef of merchantsRef) {
    const merchant = game.getMerchant(merchantRef.category);
    if (!merchant) continue;
    merchantArr.push(merchant);
  }
  return merchantArr;
} satisfies PlayerFunction);
