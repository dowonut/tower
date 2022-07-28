class Merchant {
  constructor(object) {
    for (const [key, value] of Object.entries(object)) {
      this[key] = value;
    }
  }
}

export default [
  {
    general: new Merchant({
      category: "General",
      //      name: "Blonkey",
      items: {
        apple: { stock: 21, price: 1 },
      },
    }),
    weapon: new Merchant({
      category: "Weapon",
      //      name: "Blonkey",
      items: {
        "rusty sword": { stock: 1, price: 10 },
      },
    }),
  },
];
