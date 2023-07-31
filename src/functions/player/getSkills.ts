import { game } from "../../tower.js";
import skills from "../../game/_classes/skills.js";

/** Get player skills. */
export default (async function () {
  const skills = await this.fetch<Skill>({ key: "skill" });
  return skills;
} satisfies PlayerFunction);
