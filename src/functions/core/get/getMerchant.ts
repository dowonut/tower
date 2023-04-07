import { game } from "../../../tower.js";
import merchants from "../../../game/_classes/merchants.js";

/** Get a merchant by name or category. */
export default function getMerchant(search: string) {
  const merchant = merchants.find(
    (x) => x.name == search.toLowerCase() || x.category == search.toLowerCase()
  );

  if (!merchant) return;

  return merchant;
}
