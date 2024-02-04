import Prisma from "@prisma/client";
import { StatusEffectClass } from "../../game/_classes/statusEffects.js";
import { config } from "../../tower.ts";

declare global {
  type StatusEffectData = {
    name: string;
    description: string;
    /** When to evaluate the status effect.
     * - turn_end = when the host's turn ends.
     * - turn_start = when the host's turn starts.
     * - immediate = once when the status effect is inflicted.
     */
    evaluateOn: "turn_end" | "turn_start" | "immediate";
    /** All outcomes of the status effect. */
    outcomes: StatusEffectOutcome[];
    /** For how many combat rounds does the status effect last. If left empty then infinite. */
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
    /** Message to send on evaluation. Variables: HOST, SOURCE, DAMAGE, HEALING. */
    messages: string[];
  };

  type StatusEffectOutcomeAll = {
    /** Change the host's stats. */
    modifyStat: StatusEffectModifyStat | StatusEffectModifyStat[];
    /** Change the host's health. */
    modifyHealth:
      | Omit<StatusEffectDamage, "type" | "resStat">
      | Omit<StatusEffectDamage, "type" | "resStat">[];
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
      args: { host: Enemy | Player }
    ) => Promise<{
      host?: Enemy | Player;
    }>;
    /** Damage dealt by the status effect. */
    damage: StatusEffectDamage | StatusEffectDamage[];
  };

  type StatusEffectOutcomeTypes = {
    damage: "damage";
    modify_stat: "modifyStat";
    modify_speed_gauge: "modifySpeedGauge";
    modify_health: "modifyHealth";
    custom: "evaluate";
  };

  /** Stat modifier for status effect. */
  export type StatusEffectModifyStat = {
    stat: Stat;
    type: "flat" | "multiplier";
    baseFlat?: number;
    basePercent?: number;
  };

  /** Status effect damage. */
  export type StatusEffectDamage = {
    origin?: "status_effect";
    /** Damage type. */
    type: DamageType;
    /** Where to scale stats from. Default = source. */
    statSource?: "host" | "source";
    /** What type of scaling to use. Default = percent. */
    scaling?: "flat" | "percent";
    /** If scaling = "percent" then what stat does the action scale off. */
    source?: Stat;
    /** If scaling = "percent" then the base percent of source for scaling. */
    basePercent?: number;
    /** If scaling = "flat" then the base damage amount. */
    baseFlat?: number;
    /** Which stat to use for scaling resistance. Default = equivalent to source stat. */
    resStat?: "RES" | "MAG_RES" | "SPC_RES";
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