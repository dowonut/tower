export default {
  floor: 1,
  category: "blacksmith",
  name: "jimmy",
  description: "This guy loves sharp things.",
  items: [
    { name: "rusty sword", stock: 1, price: 10 },
    { name: "rusty axe", stock: 1, price: 10 },
    { name: "rusty hammer", stock: 1, price: 10 },
    { name: "rusty shield", stock: 1, price: 10 },
    { name: "rusty spear", stock: 1, price: 10 },
    { name: "rusty halberd", stock: 1, price: 10 },
    { name: "crooked bow", stock: 1, price: 10 },
    { name: "sturdy sword", stock: 1, price: 50 },
    // { name: "sword handle recipe", stock: 1, price: 5 },
    // { name: "stone axe recipe", stock: 1, price: 5 },
  ],
} as const satisfies MerchantData;
