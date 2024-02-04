import { config, game } from "../../../tower.js";

/**
 * Get formatted enemy info.
 */
export default async function getEnemyInfo(args: {
  message: Message;
  player: Player;
  enemyData?: Enemy;
  /** Shows all info. Default: true. */
  verbose?: boolean;
}) {
  const { message, player, enemyData, verbose = true } = args;
}
