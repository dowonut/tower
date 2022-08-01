import game from "../functions/titleCase.js";

class Item {
  constructor(object) {
    for (const [key, value] of Object.entries(object)) {
      this[key] = value;
    }

    if (this.category == "Food")
      this.description += ` Heals ${this.health} HP.`;

    this.getName = () => {
      return game.titleCase(this.name);
    };
  }
}

export default [
  new Item({
    name: "apple",
    category: "food",
    description: "A tasty apple.",
    info: "A tasty apple you found lying on the ground somewhere...",
    image: "https://imgur.com/GdkgHAm.png",
    health: 5,
  }),
  new Item({
    name: "slimeball",
    category: "crafting",
    description: "A ball of slime, very round and slimy.",
    info: "A concentrated ball of slime collected by killing Slimes.",
    image: "https://imgur.com/LsZOZhU.png",
    value: 1,
  }),
  new Item({
    name: "goblin skin",
    category: "crafting",
    description: "Has a rough texture and an unpleasant smell.",
    info: "A rough hide of skin collected by killing Goblins.",
    image: "https://imgur.com/EQmCvy0.png",
    value: 5,
  }),
  new Item({
    name: "rusty sword",
    category: "weapon",
    weaponType: "sword",
    description: "Not the sharpest tool in the shed.",
    info: "An old rusty sword. Use it wisely before it falls aprt.",
    image: "",
    value: 8,
    equipSlot: "hand",
    damage: {
      value: 3,
      type: "slashing",
    },
  }),
  new Item({
    name: "rock",
    category: "crafting",
    weaponType: "rock",
    description: "Literally just a rock.",
    info: "Why did you pick up a rock?",
    equipSlot: "hand",
    damage: {
      value: 1,
      type: "bludgeoning",
    },
  }),
  new Item({
    name: "stick",
    category: "crafting",
    description: "A stick from a tree.",
    info: "Very grippy and satisfying to hold. You get an urge to hit something with it.",
  }),
  new Item({
    name: "fabric",
    category: "crafting",
    description: "A piece of fabric.",
    info: "You could use it to wipe your nose.",
    value: 1,
  }),
  new Item({
    name: "leather",
    category: "crafting",
    description: "A firm piece leather.",
    info: "Leather from a cow. Useful for making things out of leather.",
    value: 1,
  }),
];
