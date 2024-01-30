import { ActionClass } from "../../game/_classes/actions.ts";
import Prisma from "@prisma/client";
import { config } from "../../tower.ts";

declare global {
  /** Enemy or player action. */
  export type ActionData = {
    name: string;
    /** Action type.
     *
     * - weapon_attack = attacks made with weapons.
     * - magic = actions classified as magic.
     * - ability = actions classified as abilities.
     */
    type: ActionType;
    /** For weapon attacks. Dictates the requirements for being able to use the action. For example: "sword" can only be uses when wielding a sword type weapon. */
    requiredWeapon?: WeaponType[];
    /** Action description. */
    description?: string;
    /** All effects caused by the action. */
    effects: ActionEffect[];
    /** How many rounds until next available. Default = 0.*/
    cooldown?: number;
  };

  /** Effects caused by an action. */
  export type ActionEffect<T = ActionEffectType> = T extends keyof ActionEffectTypes
    ? ActionEffectDefault<T> & Pick<ActionEffectAll, ActionEffectTypes[T]>
    : ActionEffectDefault<T>;

  /** Possible action effect types. */
  export type ActionEffectTypes = {
    damage: "damage";
    apply_status: "status";
    custom: "evaluate";
  };

  /** Default action effect data. */
  export type ActionEffectDefault<T> = {
    /** Type of effect inflicted by the action.
     *
     * - damage = deal damage to the target.
     * - apply_status = apply a status effect to the target.
     * - custom = define a custom function to evaluate outcome.
     */
    type: T;
    /** Allow action to target allies or enemies. Default: enemies. */
    targetMode?: "allies" | "enemies";
    /** The selected target this effect applies to. If greater than 1, player will be asked to select additional enemies. Default = 1.*/
    targetNumber?: number;
    /** What type of targeting the effect uses.
     *
     * - single = one enemy.
     * - adjacent = one enemy and adjacent enemies.
     * - all = all enemies.
     * - choose = player can choose targets.
     *
     * Default: single. */
    targetType?: TargetType;
    /** Message sent for this effect instance. Variables: TARGET, DAMAGE, STATUS, SOURCE. */
    messages: string[];
    /** Target for action effect. DO NOT DEFINE. */
    targets?: (Enemy | Player)[];
  };

  /** All action effect data. */
  export type ActionEffectAll = {
    /** If type = damage then define damage type. */
    damage?: ActionEffectDamage[] | ActionEffectDamage;
    /** If type = apply_status then define status type. */
    status?: {
      type: "fixed" | "custom";
      name: string;
    };
    /** If type = change_stat then define stat type and change. */
    changeStat?: {
      stat: "HP" | "";
    };
    /** Optional function to evaluate effect. */
    evaluate?: (
      this: ActionEffect,
      args: { source: Enemy | Player }
    ) => Promise<{
      players?: Player[];
      enemies?: Enemy[];
    }>;
  };

  /**
   * Action with evaluated damage.
   */
  export type EvaluatedActionEffect = Modify<ActionEffect, { damage: number }>;

  export type ActionBase = ActionData & Prisma.Action;

  export type Action = ActionClass;

  /** Action effect damage. */
  export type ActionEffectDamage = {
    /** Damage type. */
    type: DamageType;
    /** What stat does the action scale off. */
    source: keyof typeof config.baseStats;
    /** The base percent of source for scaling. */
    basePercent: number;
  };

  /**
   * Evaluated damage towards a target.
   */
  export type EvaluatedDamage = {
    instances: { type: DamageType; total: number }[];
    total: number;
  };
}

export {};
