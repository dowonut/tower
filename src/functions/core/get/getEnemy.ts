import { game } from "../../../tower.js";
import enemies from "../../../game/_classes/enemies.js";

/** Get enemy by name. */
export default function getEnemy(name: string) {
  const enemy = enemies.find((x) => x.name == name.toLowerCase());
  return enemy;
}
