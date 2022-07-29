import randomFunction from "../functions/random.js";
import { emojis } from "../config.js";
const random = randomFunction.random;

class Attack {
  constructor(object) {
    for (const [key, value] of Object.entries(object)) {
      this[key] = value;
    }

    // Calculate base attack damage
    this.baseDamage = async () => {
      return random(this.damage.min, this.damage.max);
    };

    // Calculate all damage bonuses
    this.damageBonus = async (player) => {
      const item = await player.getEquipped("hand");

      if (!item) return 0;

      return item.damage.value;
    };

    // Calculate damage multipliers
    this.damageMultiplier = async (player) => {
      return player.strength / 100 + 1;
    };

    this.getDamage = async (player) => {
      // Base damage
      const baseDamage = await this.baseDamage();

      // Damage bonus
      const damageBonus = await this.damageBonus(player);

      // Damage multiplier
      const damageMultiplier = await this.damageMultiplier(player);

      // Final damage
      const damage = Math.floor((baseDamage + damageBonus) * damageMultiplier);

      // Log damage
      console.log(
        `${player.username} damage: (${baseDamage} + ${damageBonus}) x ${damageMultiplier} = ${damage}`
      );
      return damage;
    };

    this.damageInfo = async (player) => {
      // Damage multiplier
      const damageMultiplier = await this.damageMultiplier(player);

      // Damage bonus
      const damageBonus = await this.damageBonus(player);

      const damageMin = Math.floor(
        (this.damage.min + damageBonus) * damageMultiplier
      );
      const damageMax = Math.floor(
        (this.damage.max + damageBonus) * damageMultiplier
      );
      const emoji = emojis.damage[this.damage.type];

      // Send damage info
      return `\`${damageMin} - ${damageMax}\`${emoji}`;
    };
  }
}

export default {
  punch: new Attack({
    name: "Punch",
    type: "unarmed",
    description: "A simple punch using your fist.",
    damage: { min: 1, max: 3, type: "bludgeoning" },
  }),
  // uppercut: new Attack({
  //   name: "Uppercut",
  //   type: "Unarmed",
  //   description: "A nasty uppercut using your fist.",
  //   cooldown: 3,
  //   damage: { min: 3, max: 6, type: "bludgeoning" },
  // }),
  // "fire breath": new Attack({
  //   name: "Fire Breath",
  //   type: "Magic",
  //   description: "Literally breathing fire.",
  //   //cooldown: 10,
  //   damage: { min: 15, max: 20, type: "fire" },
  // }),
  slash: new Attack({
    name: "Slash",
    type: "sword",
    description: "A simple swing of your sword.",
    damage: { min: 5, max: 8, type: "slashing" },
  }),
};
