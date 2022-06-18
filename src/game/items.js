class Item {
  constructor(name, cat, desc, itemInfo, value, heal) {
    this.name = name;
    this.category = cat;
    this.description = desc;
    this.itemInfo = itemInfo;
    this.value = value || null;
    this.health = heal || null;

    if (this.category == "Food") this.description += ` Heals ${heal} HP.`;
  }
}

export default {
  Apple: new Item(
    "Apple",
    "Food",
    "A tasty apple.",
    "A tasty apple you found lying on the ground somewhere.",
    null,
    5
  ),
  Slimeball: new Item(
    "Slimeball",
    "Crafting",
    "A ball of slime, very round and slimy.",
    "A concentrated ball of slime collected by killing Slimes.",
    1
  ),
  "Goblin Skin": new Item(
    "Goblin Skin",
    "Crafting",
    "Has a rought texture and an unpleasant smell.",
    "A rough hide of skin collected by killing Goblins.",
    3
  ),
};
