import Prisma from "@prisma/client";
import { EnemyClass } from "../../game/_classes/enemies.ts";

declare global {
  /**
   * Enemy data.
   */
  export type EnemyData = {
    name: string;
    /** Type the enemy belongs to. Must be the name of an existing enemy type. */
    type: string;
    description: string;
    /** Optional base HP. Will default to level scaling. */
    baseHP?: number;
    /** Optional base Speed Value. Will default to level scaling. */
    baseSPD?: number;
    /** Enemy level. */
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
    xp: number;
    /** Do not assign. Determined by enemy type. */
    totalXp?: { min: number; max: number };
  };

  /** Enemy data but with enemy type checked. */
  export type EnemyDataWithType = Modify<EnemyData, { type: EnemyType }>;

  /**
   * Base enemy type.
   */
  export type EnemyBase = EnemyDataWithType & Prisma.Enemy;

  /**
   * Enemy class.
   */
  export type Enemy = EnemyClass;

  /**
   * General enemy class.
   */
  export type EnemyType = {
    name: string;
    /** Base XP dropped by enemy type. Value is combined with specific enemy XP. */
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
    /** Message(s) to send when attack is performed. Variables: ENEMY, PLAYER, DAMAGE. */
    messages?: string[];
    /** How many combat rounds the attack takes to cooldown. */
    cooldown?: number;
    damage: AttackDamage[];
  };

  /**
   * Enemy attack with evaluated damage.
   */
  export type EvaluatedEnemyAttack = Modify<EnemyAttack, { damage: number }>;
}

export {};
