import { createClassFromType, loadFiles } from "../../functions/core/index.js";
import { game, config } from "../../tower.js";

const MerchantBaseClass = createClassFromType<MerchantData>();

export class MerchantClass extends MerchantBaseClass {
  constructor(object: Generic<MerchantData>) {
    super(object);
  }

  /** Get all items as class instances. */
  async getItems(p: Player) {
    return await game.getMerchantItems(p, this.name);
  }
}

const merchants = await loadFiles<MerchantClass>("merchants", MerchantClass);

export default merchants;
