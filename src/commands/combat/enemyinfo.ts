import _ from "lodash";
import { ActionClass } from "../../game/_classes/actions.js";
import generic from "../../game/_classes/generic.js";
import { game, config, client, prisma } from "../../tower.js";

/** @type {Command} */
export default {
  name: "enemyinfo",
  aliases: ["ei"],
  description: "View detailed information about an enemy.",
  category: "combat",
  useInCombat: true,
  useInDungeon: true,
  arguments: [
    {
      name: "enemy",
      filter: async (i, p, a) => {
        // If not in combat get generic enemy
        if (!p.inCombat) {
          const enemyData = game.getEnemy(i);
          if (!enemyData) {
            return { success: false, message: `No enemy found with name \`${i}\`` };
          } else {
            return { success: true, content: enemyData };
          }
        }
        // Get specific enemy
        else {
          const enemies = await p.getEnemies();
          const selected = enemies?.find((x) => {
            return x.name == i.toLowerCase() || parseInt(i) == x.number;
          });
          if (!selected) {
            return { success: false, message: `No enemy found with name or number **\`${i}\`**` };
          } else {
            return { success: true, content: selected };
          }
        }
      },
      required: false,
    },
  ],
  async execute(message, args: { enemy: Enemy }, player, server) {
    let { enemy } = args;

    if (!player.encounter && !enemy) {
      return game.error({ player, content: `provide the name of the enemy you want to view.` });
    }

    const menu = new game.Menu({
      player,
      variables: {
        currentEnemy: enemy || undefined,
        currentCategory: "stats" as "stats" | "actions" | "status_effects",
      },
    });

    menu.setMessages([
      {
        name: "main",
        function: (m) => {
          let enemy = m.variables.currentEnemy;
          let description = ``;
          let title = ``;
          // Return with placeholder embed
          if (!enemy) {
            title = `Enemy Info`;
            description = `*No enemy selected*`;
            return game.fastEmbed({ player, title, description, fullSend: false, reply: true });
          }

          title = `${enemy?.dead ? "Dead " : ""}` + enemy.getName() + ` | \`Lvl. ${enemy.level}\``;
          const image = enemy.getImageAttachment();

          description += `*${enemy.description}*\n`;

          // Format embed during combat encounter
          if (player.inCombat) {
            description += `\n${game.fastProgressBar("health", enemy)}\n`;
          }

          // Get information for current category
          switch (m.variables.currentCategory) {
            //* Stats
            case "stats":
              description += `\n${enemy.getStatsInfo()}`;
              break;
            //* Actions
            case "actions":
              for (const actionData of enemy.type.actions.filter((x) =>
                enemy.actions.includes(x.name as any)
              )) {
                const action = new ActionClass(actionData as any);
                let infoObject = action.getInfo();
                let damageInfo = infoObject.damage[0] ? `\n\n` + infoObject.damage.join("") : "";
                let statusEffectInfo = infoObject.apply_status[0]
                  ? `\n\n` + infoObject.apply_status.join("")
                  : "";
                let customInfo = infoObject.custom[0] ? `\n\n` + infoObject.custom.join("") : "";
                description += `\n### ${game.titleCase(
                  action.name
                )}\n${damageInfo}${statusEffectInfo}${customInfo}`;
              }
              break;
            //* Status effects
            case "status_effects":
              const statusEffects = _.orderBy(enemy.getStatusEffects(), ["type"], ["desc"]);
              if (_.isEmpty(statusEffects)) {
                description += `\nThis enemy has no active status effects...`;
                break;
              }
              for (const statusEffect of statusEffects) {
                const remDuration =
                  statusEffect?.remDuration > 0
                    ? ` | \`${statusEffect.remDuration} turns remaining\``
                    : "";
                description += `\n${statusEffect.getEmoji()}**${statusEffect.getName()}**${remDuration}\n`;
              }
              break;
          }

          return game.fastEmbed({
            player,
            title,
            description,
            thumbnail: "attachment://enemy.png",
            files: [image],
            fullSend: false,
            reply: true,
          });
        },
      },
    ]);

    menu.setRows([
      {
        name: "categories",
        type: "buttons",
        components: (m) => [
          {
            id: "stats",
            label: "Stats",
            disable: "stats" == m.variables.currentCategory,
            function: () => {
              m.variables.currentCategory = "stats";
              m.refresh();
            },
          },
          {
            id: "actions",
            label: "Actions",
            disable: "actions" == m.variables.currentCategory,
            function: () => {
              m.variables.currentCategory = "actions";
              m.refresh();
            },
          },
          {
            id: "status_effects",
            label: "Status Effects",
            disable: "status_effects" == m.variables.currentCategory || !player.inCombat,
            function: () => {
              m.variables.currentCategory = "status_effects";
              m.refresh();
            },
          },
        ],
      },
      {
        name: "select_enemy",
        type: "menu",
        components: async (m) => {
          if (!m.player.inCombat) return;
          const enemies = (await m.player.getEnemies()).sort((a, b) => a.number - b.number);
          return {
            id: "select_enemy",
            placeholder: "Select an enemy for more information...",
            options: enemies.map((x) => ({
              id: x.name + x.number,
              label: x.displayName,
              value: x.number.toString(),
              default: m.variables.currentEnemy?.number == x.number,
              emoji: x.getEmoji(),
            })),
            function: (r, i, s) => {
              m.variables.currentEnemy = enemies.find((x) => x.number == parseInt(s));
              m.refresh();
            },
          };
        },
      },
    ]);

    menu.setBoards([
      { name: "no_encounter", message: "main", rows: ["categories"] },
      { name: "encounter", message: "main", rows: ["categories", "select_enemy"] },
    ]);

    if (player.inCombat) {
      menu.init("encounter");
    } else {
      menu.init("no_encounter");
    }
  },
} as Command;
