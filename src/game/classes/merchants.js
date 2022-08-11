class Merchant {
  constructor(object) {
    for (const [key, value] of Object.entries(object)) {
      this[key] = value;
    }

    this.getName = () => {};
  }
}

export default [
  // floor 1
  [
    new Merchant({
      category: "general",
      name: "uncle",
      items: {
        apple: { stock: 21, price: 1 },
        leather: { stock: 9, price: 3 },
      },
    }),
    new Merchant({
      category: "weapons",
      name: "jimmy",
      items: {
        "rusty sword": { stock: 1, price: 10 },
        "sword handle recipe": { stock: 1, price: 5 },
      },
    }),
    new Merchant({
      category: "cartographer",
      name: "azathoth",
      items: {},
    }),
  ],
  // floor 2
  [],
];
