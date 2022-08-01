import game from "../functions/titleCase.js";

class Skill {
  constructor(object) {
    for (const [key, value] of Object.entries(object)) {
      this[key] = value;
    }

    this.getName = () => {
      return game.titleCase(this.name);
    };

    this.levelInfo = (level) => {
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
      { info: "Increase unarmed damage by `10%`" },
    ],
  }),
  new Skill({
    name: "melee combat",
  }),
  new Skill({
    name: "ranged combat",
  }),
  new Skill({
    name: "magic",
  }),
  new Skill({
    name: "mining",
  }),
  new Skill({
    name: "fishing",
  }),
  new Skill({
    name: "woodcutting",
  }),
];
