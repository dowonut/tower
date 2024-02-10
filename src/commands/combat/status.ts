import _ from "lodash";
import { game, config, client, prisma } from "../../tower.js";

export default {
  name: "status",
  aliases: ["st"],
  description: "View your current health and status effects.",
  category: "combat",
  useInCombat: true,
  useInDungeon: true,
  async execute(message, args, player, server) {
    const statusEffects = _.orderBy(player.getStatusEffects(), ["type"], ["desc"]);

    const menu = new game.Menu({ player, variables: { selectedStatusEffect: undefined } });

    menu.setMessages([
      {
        name: "main",
        function: (m) => {
          const title = `${player.user.username}'s Status`;
          let description = `${game.fastProgressBar("health", player)}\n\n`;
          for (const statusEffect of statusEffects) {
            let emoji = m.variables.selectedStatusEffect ? config.emojis.blank : "";
            if (statusEffect.id == m.variables.selectedStatusEffect) emoji = "👉";
            const remDuration =
              statusEffect?.remDuration > 0
                ? ` | \`${statusEffect.remDuration} turns remaining\``
                : "";
            description += `${emoji}${statusEffect.getEmoji()}**${statusEffect.getName()}**${remDuration}\n`;
          }

          if (m.variables.selectedStatusEffect) {
            const statusEffect = statusEffects.find(
              (x) => x.id == m.variables.selectedStatusEffect
            );
            description += `\n### ${statusEffect.getEmoji()}**${statusEffect.getName()}**\n${statusEffect.getInfo()}`;
          }

          return game.fastEmbed({
            player,
            title,
            thumbnail: player.user.pfp,
            description,
            fullSend: false,
          });
        },
      },
    ]);

    // Get select menu for status effects
    if (!_.isEmpty(statusEffects)) {
      menu.setRows([
        {
          name: "select_status_effect",
          type: "menu",
          components: (m) => ({
            id: "select_status_effect",
            placeholder: "Select a status effect for more information...",
            options: statusEffects.map((s) => {
              return {
                value: s.id.toString(),
                label: s.getName(),
                emoji: s.getEmoji(),
                default: m.variables?.selectedStatusEffect == s.id,
                description: s?.description || "",
              };
            }),
            function: (r, i, s) => {
              m.variables.selectedStatusEffect = parseInt(s);
              m.refresh();
            },
          }),
        },
      ]);

      menu.setBoards([{ name: "main", message: "main", rows: ["select_status_effect"] }]);
    }
    // No status effects
    else {
      menu.setRows([]);
      menu.setBoards([{ name: "main", message: "main", rows: [] }]);
    }

    menu.init("main");
  },
} satisfies Command;
