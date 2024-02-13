import Prisma from "@prisma/client";
import { StatusEffectClass } from "../../game/_classes/statusEffects.js";
import { config } from "../../tower.ts";

declare global {
  type StatusEffectData = {
    name: string;
    description: string;
    /** Whether the status effect is classified as a buff or a debuff. Only affects visual indicators. */
    type: "buff" | "debuff";
    /** When to evaluate the status effect. Also affects when the duration is modified.
     * - turn_end = when the host's turn ends.
     * - turn_start = when the host's turn starts.
     * - immediate = once when the status effect is inflicted.
     */
    evaluateOn: "turn_end" | "turn_start" | "immediate";
    /** All outcomes of the status effect. */
    outcomes: StatusEffectOutcome[];
    /** How many turns the status effect lasts for, decreased during evaluateOn. If left empty then infinite. */
    duration?: number;
    /** Can the status effect can stack. Default: true.*/
    stackable?: boolean;
  };

  type StatusEffectOutcomeDefault<T> = {
    /** Type of effect.
     * damage = deal damage to the host.
     * modify_stat = passively modify the host's stats.
     * modify_speed_gauge = immediately modify the host's speed gauge.
     * custom = evaluate a custom function.
     */
    type: T;
    /** Optional message to send on evaluation. Variables: HOST, SOURCE, DAMAGE, HEAL. */
    messages?: string[];
    /** Whether the status effect is evaluated passively or actively. Default = active.
     * - active = the status effect has all its outcomes evaluated on evaluateOn.
     * - passive = the status effect never has its outcomes evaluated.
     */
    evaluateType?: "active" | "passive";
  };

  type StatusEffectOutcomeAll = {
    /** Change the host's stats. */
    modifyStat: StatusEffectModifyStat | StatusEffectModifyStat[];
    /** Change the host's health. */
    modifyHealth: StatusEffectHeal | StatusEffectHeal[];
    /** Modify the host's speed gauge. */
    modifySpeedGauge: {
      /** Whether to advance forward or delay. */
      type: "forward" | "delay";
      /** Percent amount to modify speed gauge. */
      percent: number;
    };
    /** Function to evaluate status effect. */
    evaluate?: (
      this: StatusEffectOutcome,
      args: { host: Enemy | Player; source: Enemy | Player }
    ) => Promise<{
      host?: Enemy | Player;
    }>;
    /** Damage dealt by the status effect. */
    damage: StatusEffectDamage | StatusEffectDamage[];
    /** Get custom info text. */
    info: string | ((this: StatusEffectOutcome) => string);
  };

  type StatusEffectOutcomeTypes = {
    damage: "damage";
    modify_stat: "modifyStat";
    modify_speed_gauge: "modifySpeedGauge";
    modify_health: "modifyHealth";
    custom: "evaluate" | "info";
  };

  /** Stat modifier for status effect. */
  export type StatusEffectModifyStat = {
    /** Which of the host's stats to modify. */
    stat: Stat_;
  } & (
    | { scaling: "flat"; baseFlat: number }
    | {
        scaling: "percent";
        basePercent: number;
      }
  );

  /** Status effect damage. */
  export type StatusEffectDamage = {
    /** DO NOT DEFINE. */
    origin?: "status_effect";
    /** Damage type. */
    type: DamageType;
    /** Which stat to use for scaling resistance. Default = equivalent to source stat. */
    resStat?: "RES" | "MAG_RES" | "SPC_RES";
  } & (
    | {
        /** What type of scaling to use.*/
        scaling: "flat";
        /** If scaling = "flat" then the base damage amount. */
        baseFlat: number;
      }
    | {
        /** What type of scaling to use.*/
        scaling: "percent";
        /** Where to scale stats from. Default = source. */
        statSource?: "source" | "host";
        /** If scaling = "percent" then what stat does the action scale off. */
        scalingStat: Stat;
        /** If scaling = "percent" then the base percent of source for scaling. */
        basePercent: number;
      }
  );

  /** Modify health info. */
  export type StatusEffectHeal =
    | {
        /** What type of scaling to use.*/
        scaling: "flat";
        /** If scaling = "flat" then the base healing amount. */
        baseFlat: number;
      }
    | {
        /** What type of scaling to use.*/
        scaling: "percent";
        /** Where to scale stats from. Default = source. */
        statSource?: "source" | "host";
        /** If scaling = "percent" then what stat does the healing scale off. */
        scalingStat: Stat;
        /** If scaling = "percent" then the base percent of source for scaling. */
        basePercent: number;
      };

  export type StatusEffectOutcome<T = StatusEffectOutcomeType> =
    T extends keyof StatusEffectOutcomeTypes
      ? StatusEffectOutcomeDefault<T> & Pick<StatusEffectOutcomeAll, StatusEffectOutcomeTypes[T]>
      : StatusEffectOutcomeDefault<T>;

  export type StatusEffectOutcomeType = keyof StatusEffectOutcomeTypes;

  export type StatusEffectBase = Prisma.StatusEffect & Prisma.EnemyStatusEffect & StatusEffectData;

  export type StatusEffect = StatusEffectClass;
}
export {};
