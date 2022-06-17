import randomFunction from "../functions/random.js";
const random = randomFunction.random;

export default {
  punch: {
    name: "Punch",
    type: "Fists",
    description: "A simple punch using your fist.",
    damageInfo: "STR+1D3 bludgeoning",
    damage: (strength) => {
      return strength + random(1, 3);
    },
  },
  uppercut: {
    name: "Uppercut",
    type: "Fists",
    description: "A nasty uppercut using your fist.",
    cooldown: 10,
    damageInfo: "STR+1D6 bludgeoning",
    damage: (strength) => {
      return strength + random(1, 6);
    },
  },
};
