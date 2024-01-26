import { game } from "../../tower.js";

/** Get skill by name. */
export default (async function (name: string): Promise<Skill> {
  const skill = await this.fetch<Skill, string>({ key: "skill", name });
  return skill;
} satisfies PlayerFunction);
