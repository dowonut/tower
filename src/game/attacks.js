import randomFunction from "../functions/random.js";
import { emojis } from "../config.js";
const random = randomFunction.random;

class Attack {
  constructor(object) {
    for (const [key, value] of Object.entries(object)) {
      this[key] = value;
    }

    this.damage = (player) => {
      return player.strength + random(this.damageMin, this.damageMax);
    };

    this.damageInfo = (player) => {
      return `\`${this.damageMin + player.strength} - ${
        this.damageMax + player.strength
      }\`${emojis.damage[this.damageType]}`;
    };
  }
}

export default {
  punch: new Attack({
    name: "Punch",
    type: "Fists",
    description: "A simple punch using your fist.",
    damageMin: 1,
    damageMax: 3,
    damageType: "bludgeoning",
  }),
  uppercut: new Attack({
    name: "Uppercut",
    type: "Fists",
    description: "A nasty uppercut using your fist.",
    cooldown: 3,
    damageMin: 3,
    damageMax: 6,
    damageType: "bludgeoning",
  }),
  "fire breath": new Attack({
    name: "Fire Breath",
    type: "Magic",
    description: "Literally breathing fire.",
    //cooldown: 10,
    damageMin: 15,
    damageMax: 20,
    damageType: "fire",
  }),
};
