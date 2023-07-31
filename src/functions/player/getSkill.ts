import { game } from "../../tower.js";

/** Get skill by name. */
export default (async function (name: string) {
  const skill = this.fetch<Skill, string>({ key: "skill", name });
  return skill;
} satisfies PlayerFunction);
