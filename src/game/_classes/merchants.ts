import { createClassFromType, loadFiles } from "../../functions/core/index.js";
import { game, config } from "../../tower.js";

const MerchantBaseClass = createClassFromType<MerchantData>();

export class MerchantClass extends MerchantBaseClass {
  constructor(object: Generic<MerchantData>) {
    super(object);
  }
}

const merchants = await loadFiles<MerchantClass>("merchants", MerchantClass);

export default merchants;
