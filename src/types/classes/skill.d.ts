declare global {
  export type SkillData = {
    name: string;
    /** Skill category. */
    category: "combat" | "crafting";
    /** If combat skill, which weapon type does it belong to. */
    weaponType?: AttackType;
    /** Things to unlock as the skill levels up. */
    levels: SkillLevel[];
  };

  export type SkillLevel = (SkillLevelAddPassive | SkillLevelNewAttack) & {
    info?: string;
  };

  type SkillLevelNewAttack = {
    type: "attack";
    /** Name of the attack to unlock. */
    name: string;
  };
  type SkillLevelAddPassive = {
    type: "passive";
    /** Name of the passive to apply. */
    name: string;
    /** Value the passive applies to. */
    target: string;
    /** How much to increase the passve by. */
    value: number;
  };
}
export {};
