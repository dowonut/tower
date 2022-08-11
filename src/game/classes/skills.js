import game from "../../functions/titleCase.js";

class Skill {
  constructor(object) {
    for (const [key, value] of Object.entries(object)) {
      this[key] = value;
    }

    this.getName = () => {
      return game.titleCase(this.name);
    };

    this.levelInfo = (level) => {
      console.log(this.levels);

      if (!this.levels[level - 1]) return undefined;

      return this.levels[level - 1].info;
    };
  }
}

export default [
  new Skill({
    name: "unarmed combat",
    levels: [
      { info: "Unlock new attack `Uppercut`" },
      { info: "Increase unarmed damage by `5%`" },
    ],
  }),
  new Skill({
    name: "sword combat",
    levels: [],
  }),
  new Skill({
    name: "axe combat",
    levels: [],
  }),
  new Skill({
    name: "spear combat",
    levels: [],
  }),
  new Skill({
    name: "bow combat",
    levels: [],
  }),
  new Skill({
    name: "magic",
    levels: [],
  }),
  new Skill({
    name: "mining",
    levels: [],
  }),
  new Skill({
    name: "fishing",
    levels: [],
  }),
  new Skill({
    name: "woodcutting",
    levels: [],
  }),
];
