import { AttackClass } from "../../game/_classes/attacks.ts";
import Prisma from "@prisma/client";
import { config } from "../../tower.ts";

declare global {
  export type AttackData = {
    name: string;
    /** Attack type. Dictates the requirements for being able to use it. For example: "sword" can only be uses when wielding a sword type weapon. */
    weaponType: AttackType[];
    description: string;
    /** All damage dealt by the attack. */
    damage: AttackDamage[];
    /** Message sent when using the attack. Variables: ENEMY, DAMAGE, PLAYER. */
    messages: string[];
    /** How many combat rounds between uses. */
    cooldown?: number;
  };

  export type AttackDamage = {
    type: DamageType;
    source: keyof typeof config.baseStats;
    basePercent: number;
    total?: number;
  };

  export type AttackBase = AttackData & Prisma.Attack;

  export type Attack = AttackClass;
}

export {};
