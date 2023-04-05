import { game } from "../../tower.js";

/** Exit combat. */
export default (async function () {
  await this.update({ fighting: null, inCombat: false, canAttack: true });
} satisfies PlayerFunction);
