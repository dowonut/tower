import { AttackClass } from "../../game/_classes/attacks.ts";
import Prisma from "@prisma/client";
import { config } from "../../tower.ts";

declare global {
  export type AttackData = {
    name: string;
    /** Attack type. Dictates the requirements for being able to use it. For example: "sword" can only be uses when wielding a sword type weapon. */
    weaponType: WeaponType[];
    /** Attack description. */
    description: string;
    /** All damage dealt by the attack. */
    damage: DamageInstance[];
    /** Message sent when using the attack. Variables: ENEMY, DAMAGE, PLAYER. */
    messages: string[] | { targetType: TargetType; list: string[] }[];
    /** How many combat rounds between uses. */
    cooldown?: number;
  };

  /** Attack damage. */
  export type DamageInstance = {
    /** Damage type. */
    type: DamageType;
    /** What stat does the attack scale off. */
    source: keyof typeof config.baseStats;
    basePercent: number;
    /** What type of targeting the damage uses.
     *
     * - single = one enemy.
     * - adjacent = one enemy and adjacent enemies.
     * - all = all enemies.
     * - choose = player can choose targets.
     *
     * Default: single. */
    targetType?: TargetType;
    /** Target for damage instance. */
    targets?: (Enemy | Player)[];
  };

  /**
   * Enemy attack with evaluated damage.
   */
  export type EvaluatedAttack = Modify<Attack, { damage: number }>;

  export type AttackBase = AttackData & Prisma.Attack;

  export type Attack = AttackClass;

  /**
   * Evaluated damage towards a target.
   */
  export type EvaluatedDamage = {
    instances: { type: DamageType; total: number }[];
    total: number;
  };

  /** Evaluated damage instance for all targets. */
  export type EvaluatedDamageInstance = {
    /** Array of targets hit by attack. */
    targets: { target: Enemy | Player; type: DamageType; total: number }[];
  };
}

export {};
