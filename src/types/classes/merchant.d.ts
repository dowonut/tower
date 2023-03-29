import { MerchantClass } from "../../game/_classes/merchants.ts";

declare global {
  export type MerchantData = {
    /** Which floor is the merchant available on. */
    floor: number;
    category: string;
    name: string;
    items: {
      name: string;
      stock: number;
      /** Price in marks. */
      price: number;
      /** How often the item restocks (days). */
      restock?: number;
    }[];
  };

  export type Merchant = MerchantClass;
}

export {};
