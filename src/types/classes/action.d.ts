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
    /** All outcomes caused by the action. */
    outcomes: ActionOutcome[];
    /** How many rounds until next available. Default = 0.*/
    cooldown?: number;
  };

  /** Effects caused by an action. */
  export type ActionOutcome<T = ActionOutcomeType> = T extends keyof ActionOutcomeTypes
    ? ActionOutcomeDefault<T> & Pick<ActionOutcomeAll, ActionOutcomeTypes[T]>
    : ActionOutcomeDefault<T>;

  /** Possible action outcome types. */
  type ActionOutcomeTypes = {
    damage: "damage";
    apply_status: "status";
    custom: "evaluate" | "info";
  };

  /** Default action outcome data. */
  type ActionOutcomeDefault<T> = {
    /** Type of outcome inflicted by the action.
     *
     * - damage = deal damage to the target.
     * - apply_status = apply a status effect to the target.
     * - custom = define a custom function to evaluate outcome.
     */
    type: T;
    /** Allow action to target allies or enemies. Default: enemies. */
    targetMode?: "allies" | "enemies";
    /** The selected target this outcome applies to. If greater than 1, player will be asked to select additional enemies. Default = 1.*/
    targetNumber?: number;
    /** What type of targeting the outcome uses.
     *
     * - single = one enemy.
     * - adjacent = one enemy and adjacent enemies.
     * - all = all enemies.
     * - self = can only be used on themselves.
     *
     * Default: single. */
    targetType?: TargetType;
    /** Message sent for this outcome instance. Variables: SOURCE, TARGET, DAMAGE, STATUS. */
    messages: string[];
    /** Target for action outcome. DO NOT DEFINE. */
    targets?: (Enemy | Player)[];
  };

  /** All action outcome data. */
  type ActionOutcomeAll = {
    /** Define damage type. */
    damage: ActionOutcomeDamage[] | ActionOutcomeDamage;
    /** Define status type. */
    status: {
      /** Name of status outcome. */
      name: StaticStatusEffectName;
      /** Level of the status effect. Default = 1. */
      level?: number;
    };
    /** Evaluate custom outcome. */
    evaluate: (
      this: ActionOutcome,
      args: { source: Enemy | Player }
    ) =>
      | Promise<{
          players?: Player[];
          enemies?: Enemy[];
        }>
      | { players?: Player[]; enemies?: Enemy[] };
    /** Get custom info text. */
    info: string | ((this: ActionOutcome) => string);
  };

  /**
   * Action with evaluated damage.
   */
  export type EvaluatedActionOutcome = Modify<ActionOutcome, { damage: number }>;

  export type ActionBase = ActionData & Prisma.Action;

  export type Action = ActionClass;

  /** Action outcome damage. */
  export type ActionOutcomeDamage = {
    origin?: "action";
    /** Damage type. */
    type: DamageType;
    /** Where to scale stats from. Default = source. */
    statSource?: "target" | "source";
    /** What type of scaling to use. Default = percent. */
    scaling?: "flat" | "percent";
    /** If scaling = "percent" then what stat does the action scale off. */
    scalingStat?: Stat;
    /** If scaling = "percent" then the base percent of source for scaling. */
    basePercent?: number;
    /** If scaling = "flat" then the base damage amount. */
    baseFlat?: number;
    /** Which stat to use for scaling resistance. Default = equivalent to source stat. */
    resStat?: "RES" | "MAG_RES" | "SPC_RES";
  };

  /**
   * Evaluated damage towards a target.
   */
  export type EvaluatedDamage = {
    instances: {
      /** The type of damage. */
      type: DamageType;
      /** The total amount of damage. */
      total: number;
      /** Is the damage instance a critical hit. Default = false.*/
      crit: boolean;
      /** Is the damage instance an acute hit. Default = false. */
      acute: boolean;
    }[];
    total: number;
  };

  /** Object containing selected targets. */
  export type Targets = {
    [key: number]: Enemy | Player;
  };
}

export {};
