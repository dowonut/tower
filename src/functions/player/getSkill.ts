import { game } from "../../tower.js";

/** Get skill by name. */
export default (async function (name: string) {
  const skill = await this.fetch<Skill, string>({ key: "skill", name });
  return skill[0];
} satisfies PlayerFunction);
