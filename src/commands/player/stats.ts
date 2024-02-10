import emojis from "../../emojis.js";
import { f } from "../../functions/core/index.js";
import { config, game } from "../../tower.js";

export default {
  name: "stats",
  aliases: ["s"],
  description: "View all your stats.",
  arguments: [{ name: "user", type: "user", required: false }],
  category: "player",
  useInCombat: true,
  useInDungeon: true,
  async execute(message, args: { user: Player }, player, server) {
    if (args.user) {
      player = args.user;
    }

    const weapon = await player.getEquipped("hand");

    const menu = new game.Menu({ player, variables: { verbose: false } });

    menu.setMessages([
      {
        name: "main",
        function: (m) => {
          let description = ``;
          let title = `${player.user.username}'s Stats`;

          for (let statName of Object.keys(config.baseStats) as PlayerStat[]) {
            const { stats } = config.emojis;
            let name: string = statName;
            if (statName == "maxHP") name = "Max HP";
            let percent = ``;
            if (["CR", "CD", "AR", "AD"].includes(name)) percent = `%`;
            let statText: string;
            // Show evaluated stat
            if (!m.variables.verbose) {
              statText = player.getStat(statName).toString();
              statText = game.f(statText + percent);
            }
            // Show stat details
            else {
              // Get stat information
              const { base, weaponLevelBonus, traitMultiplier, statusEffectMultiplier } =
                player.getStat(statName, true);
              // Flat bonus
              const weaponEmoji = weapon.getEmoji();
              const flatText =
                weaponLevelBonus > 0 ? ` ${weaponEmoji}${game.f("+" + weaponLevelBonus)}` : "";
              // Trait bonus
              let traitEmoji: string;
              switch (statName) {
                case "ATK":
                  traitEmoji = emojis.traits.strength;
                  break;
                case "MAG":
                  traitEmoji = emojis.traits.arcane;
                  break;
                case "maxHP":
                  traitEmoji = emojis.traits.vitality;
                  break;
                case "RES":
                case "MAG_RES":
                  traitEmoji = emojis.traits.defense;
                  break;
              }
              const traitText =
                traitMultiplier > 0
                  ? ` ${traitEmoji}${game.f("+" + traitMultiplier * 100 + "%")}`
                  : "";
              // Status effect bonus
              const statusEmoji = emojis.buff;
              const statusText =
                statusEffectMultiplier > 0
                  ? ` ${statusEmoji}${game.f("+" + statusEffectMultiplier * 100 + "%")}`
                  : "";
              // Finalize
              statText = `${game.f(base + percent)}${flatText}${traitText}${statusText}`;
            }

            description += `\n${stats[statName]} ${game.titleCase(name)}: ${statText}`;
          }

          return game.fastEmbed({
            player,
            description,
            title,
            thumbnail: player.user.pfp,
            reply: false,
            fullSend: false,
          });
        },
      },
    ]);

    menu.setRows([
      {
        name: "options",
        type: "buttons",
        components: (m) => [
          {
            id: "verbose",
            label: `Verbose: ${game.titleCase(m.variables.verbose.toString())}`,
            function: () => {
              m.variables.verbose = m.variables.verbose ? false : true;
              m.refresh();
            },
          },
        ],
      },
    ]);

    menu.setBoards([{ name: "main", message: "main", rows: ["options"] }]);

    menu.init("main");
  },
} satisfies Command;
