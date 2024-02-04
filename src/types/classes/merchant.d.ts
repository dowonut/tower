import { MerchantClass } from "../../game/_classes/merchants.ts";

declare global {
  export type MerchantData = {
    /** Which floor is the merchant available on. */
    floor: number;
    category: string;
    name: string;
    /** Merchant description. Optional. */
    description?: string;
    items: MerchantItem[];
  };

  export type MerchantItem = {
    /** Name of the item. */
    name: StaticItemName;
    /** How many in stock. */
    stock: number;
    /** Price in marks. */
    price: number;
    /** How often the item restocks (days). */
    restock?: number;
    /** Day the merchant was last restocked. */
    restocked?: number;
    /** The item stock is being tracked. */
    trackingStock?: boolean;
  };

  export type MerchantItemMerged = MerchantItem & Item;

  export type Merchant = MerchantClass;
}

export {};
