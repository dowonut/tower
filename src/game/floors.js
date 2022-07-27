class Floor {
  constructor(object) {
    for (const [key, value] of Object.entries(object)) {
      this[key] = value;
    }
  }
}

export default [
  new Floor({
    floor: 1,
    enemies: [
      {
        name: "Slime",
        weight: 80,
      },
      {
        name: "Goblin",
        weight: 20,
      },
    ],
  }),
  new Floor({
    floor: 2,
    enemies: [
      {
        name: "Goblin",
        weight: 100,
      },
    ],
  }),
];
