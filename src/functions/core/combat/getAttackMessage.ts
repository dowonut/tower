import { game, config } from "../../../tower.js";

/** Get an attack message. */
export default function getAttackMessage(args: {
  source: "enemy" | "player";
  player: Player;
  enemy: Enemy;
  damage?: number;
  attack: Attack | EvaluatedEnemyAttack;
  previousHealth?: number;
}) {
  const { source, player, enemy, damage = 0, attack, previousHealth = 0 } = args;

  let attackMessage: string;
  let healthText: string;
  let healthBar: string;
  // From player
  if (source == "player") {
    attackMessage = (attack as Attack).getMessage(player, enemy, damage);
    healthText = `${config.emojis.health} ` + game.f(`${enemy.health} / ${enemy.maxHP}`);
    healthBar = game.progressBar({
      type: "orange",
      min: enemy.health,
      max: enemy.maxHP,
      minPrevious: previousHealth,
      count: 16,
    });
  }
  // From enemy
  else if (source == "enemy") {
    attackMessage = enemy.getAttackMessage(attack as EvaluatedEnemyAttack, player);
    healthText = `${config.emojis.health} ` + game.f(`${player.health} / ${player.maxHP}`);
    healthBar = game.progressBar({
      type: "red",
      min: player.health,
      max: player.maxHP,
      minPrevious: previousHealth,
      count: 16,
    });
  }

  const finalMessage = `${attackMessage}\n\n${healthText}\n${healthBar}`;
  return finalMessage;
}
