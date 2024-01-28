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
    /** Enemy level. */
    level: number;
    /** Attacks the enemy can perform. Inherited from enemy type. */
    attacks: string[];
    /** Enemy resistances. */
    strong?: DamageType[];
    /** Enemy weaknesses. */
    weak?: DamageType[];
    /** Optional loot. */
    loot?: EnemyLoot[];
    /** Potential shard droppable by the enemy. Subject to change! */
    shard?: { dropChance: number; type: ShardType };
    /** Optionally define base stats. */
    stats?: EnemyStats;
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
    /** This enemy is a boss. Default: false. */
    isBoss?: boolean;
    /** Class resistances. */
    strong?: DamageType[];
    /** Class weaknesses. */
    weak?: DamageType[];
    /** Attacks available to this type. Inherited by specific enemies. */
    attacks: EnemyAttack[];
    /** Optionally define base stats for type. */
    stats?: EnemyStats;
    /** Optionally define base loot for type. */
    loot?: EnemyLoot[];
  };

  /** Enemy loot. */
  export type EnemyLoot = {
    /** Name of item. */
    name: string;
    /** Percent chance of dropping on kill. */
    dropChance: number;
    /** Minimum items to drop. */
    min: number;
    /** Max items to drop. */
    max: number;
  };

  /** Enemy base stats. */
  export type EnemyStats = {
    /** Optional base XP. Default: 20. */
    base_XP?: number;
    /** Optional base maxHP. Default: 0. */
    base_maxHP?: number;
    /** Optional base ATK. Default: 10. */
    base_ATK?: number;
    /** Optional base MAG. Default: 10. */
    base_MAG?: number;
    /** Optional base RES. Default: 20. */
    base_RES?: number;
    /** Optional base MAG RES. Default: 20. */
    base_MAG_RES?: number;
    /** Optional base SPD. Default: 80. */
    base_SPD?: number;
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
    damage: DamageInstance[];
  };

  /**
   * Enemy attack with evaluated damage.
   */
  export type EvaluatedEnemyAttack = Modify<EnemyAttack, { damage: EvaluatedDamage }>;
}

export {};
