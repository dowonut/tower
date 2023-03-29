import Prisma from "@prisma/client";
import { EnemyClass } from "../../game/_classes/enemies.ts";

declare global {
  /**
   * Enemey data.
   */
  export type EnemyData = {
    name: string;
    type: string;
    description: string;
    maxHealth: number;
    level: number;
    /** Attacks the enemy can perform. Inherited from enemy type. */
    attacks: string[];
    /** Enemy resistances. */
    strong?: DamageType[];
    /** Enemy weaknesses. */
    weak?: DamageType[];
    loot?: {
      name: string;
      dropChance: number;
      min: number;
      max: number;
    }[];
    /** Potential shard droppable by the enemy. Subject to change! */
    shard?: { dropChance: number; type: ShardType };
    /** XP dropped by enemy. Value is added to XP from enemy type. */
    xp: number | { min: number; max: number };
  };

  /**
   * General enemy class.
   */
  export type EnemyType = {
    name: string;
    xp: { min: number; max: number };
    /** Class resistances. */
    strong?: DamageType[];
    /** Class weaknesses. */
    weak?: DamageType[];
    /** Attacks available to that class. Inherited by specific enemies. */
    attacks: EnemyAttack[];
  };

  /**
   * Enemy attack.
   */
  export type EnemyAttack = {
    name: string;
    damage: {
      type: DamageType;
      min: number;
      max: number;
      /** Damage modifiers will be evaluated. Example: +LEVEL = add enemy level.*/
      modifier: string;
    }[];
    /** Message to send when attack is performed. Variables: ENEMY, PLAYER, DAMAGE. */
    messages: string[];
    /** How many combat rounds the attack takes to cooldown. */
    cooldown?: number;
  };

  /**
   * Base enemy type.
   */
  export type EnemyBase = EnemyData & Prisma.Enemy;

  /**
   * Enemy class.
   */
  export type Enemy = EnemyClass;
}

export {};