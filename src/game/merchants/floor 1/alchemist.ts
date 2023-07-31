export default {
  floor: 1,
  category: "alchemist",
  name: "walter",
  description: "Sells potions and stuff.",
  items: [
    { name: "strength potion", stock: 5, price: 20, restock: 1 },
    { name: "health potion", stock: 5, price: 20, restock: 1 },
    { name: "rare strength potion", stock: 5, price: 80, restock: 3 },
  ],
} satisfies MerchantData;
