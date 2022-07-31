class Item {
  constructor(object) {
    for (const [key, value] of Object.entries(object)) {
      this[key] = value;
    }

    if (this.category == "Food")
      this.description += ` Heals ${this.health} HP.`;
  }
}

export default {
  apple: new Item({
    name: "Apple",
    category: "Food",
    description: "A tasty apple.",
    info: "A tasty apple you found lying on the ground somewhere...",
    image: "https://imgur.com/GdkgHAm.png",
    health: 5,
    canSell: false,
  }),
  slimeball: new Item({
    name: "Slimeball",
    category: "Crafting",
    description: "A ball of slime, very round and slimy.",
    info: "A concentrated ball of slime collected by killing Slimes.",
    image: "https://imgur.com/LsZOZhU.png",
    value: 1,
    canSell: true,
  }),
  "goblin skin": new Item({
    name: "Goblin Skin",
    category: "Crafting",
    description: "Has a rought texture and an unpleasant smell.",
    info: "A rough hide of skin collected by killing Goblins.",
    image: "https://imgur.com/EQmCvy0.png",
    value: 5,
    canSell: true,
  }),
  "rusty sword": new Item({
    name: "Rusty Sword",
    category: "Weapon",
    weaponType: "sword",
    description: "Not the sharpest tool in the shed.",
    info: "An old rusty sword you picked up from a merchant. Kills better than your fist.",
    image: "",
    value: 8,
    canSell: true,
    equipSlot: "hand",
    damage: {
      value: 3,
      type: "slashing",
    },
  }),
};
