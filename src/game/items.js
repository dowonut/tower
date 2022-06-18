class Item {
  constructor(name, cat, desc, itemInfo, image, value, heal) {
    this.name = name;
    this.category = cat;
    this.description = desc;
    this.itemInfo = itemInfo;
    this.image = image || null;
    this.value = value || null;
    this.health = heal || null;

    if (this.category == "Food") this.description += ` Heals ${heal} HP.`;
  }
}

export default {
  apple: new Item(
    "Apple",
    "Food",
    "A tasty apple.",
    "A tasty apple you found lying on the ground somewhere...",
    "https://imgur.com/GdkgHAm.png",
    null,
    5
  ),
  slimeball: new Item(
    "Slimeball",
    "Crafting",
    "A ball of slime, very round and slimy.",
    "A concentrated ball of slime collected by killing Slimes.",
    "https://imgur.com/LsZOZhU.png",
    1
  ),
  "goblin skin": new Item(
    "Goblin Skin",
    "Crafting",
    "Has a rought texture and an unpleasant smell.",
    "A rough hide of skin collected by killing Goblins.",
    "https://imgur.com/EQmCvy0.png",
    3
  ),
};
