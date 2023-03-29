import { game } from "../../tower.js";
import merchants from "../../game/_classes/merchants.js";

/** Unlock a random merchant. */
export default (async function (message: Message, server: Server) {
  const region = this.getRegion();
  const regionName = game.titleCase(region.name);

  const foundMerchant = await this.getExploration("merchant");

  const foundMerchants = foundMerchant.map((x) => x.category);

  const merchantCategories = region.merchants.map((x) => x.category);

  let merchantC: string;
  while (!merchantC || foundMerchants.includes(merchantC)) {
    merchantC = game.getRandom(merchantCategories);
  }

  const merchant = merchants.find(
    (x) => x.category == merchantC && x.floor == this.floor
  );

  const mName = game.titleCase(merchant.name);
  const mCategory = game.titleCase(merchant.category + " merchant");

  const reply = await game.send({
    message,
    reply: true,
    content: `you explore the **${regionName}** and come across **${mName}**, the local \`${mCategory}\``,
  });
  game.commandButton({ command: "explore", message, reply, server });
  await this.addExploration({
    message,
    server,
    type: "merchant",
    category: merchantC,
  });
} satisfies PlayerFunction);