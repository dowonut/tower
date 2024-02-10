import { game, config, client, prisma } from "../../tower.js";

export default {
  name: "attack",
  aliases: ["a"],
  unlockCommands: ["enemyinfo", "flee", "status", "statuseffectinfo"],
  description: "View your attacks or attack an enemy.",
  arguments: [
    { name: "attack_name", type: "playerAvailableAttack", required: false },
    {
      name: "target_one",
      required: false,
      type: "target",
    },
    {
      name: "target_two",
      required: false,
      type: "target",
    },
    {
      name: "target_three",
      required: false,
      type: "target",
    },
  ],
  category: "combat",
  useInCombat: true,
  cooldownGroup: "combat_action",
  useInDungeon: true,
  async execute(
    message,
    args: {
      attack_name: string;
      target_one?: Enemy;
      target_two?: Enemy;
      target_three?: Enemy;
    },
    player
  ) {
    // Format imput
    let { attack_name: attackName, target_one, target_two, target_three } = args;

    // Get enemies and players
    const enemies = await player.getEnemies();

    // Define target object
    let targets: Targets = {
      1: target_one,
      2: target_two,
      3: target_three,
    };

    // Get weapon attacks for the player
    let attacks = await player.getActions({ type: "weapon_attack", onlyAvailable: true });

    let filterOptions = ["current weapon", "all"];

    // Define menu
    const menu = new game.Menu({
      player,
      boards: [{ name: "attacks", rows: ["selectAttack", "options"], message: "attacks" }],
      rows: [
        {
          name: "selectAttack",
          type: "menu",
          components: (m) => ({
            id: "selectAttack",
            placeholder: "Select attack for more information...",
            options: attacks.map((a) => ({
              value: a.name,
              label: a.getName(),
              emoji: a.getEmoji(),
              description: a?.description,
            })),
            async function(r, i, s) {
              await game.runCommand("actioninfo", {
                args: [s],
                channel: player.channel,
                server: player.server,
                discordId: player.user.discordId,
              });
            },
          }),
        },
        {
          name: "options",
          type: "buttons",
          components: (m) => [
            {
              id: "filter",
              label: `Filter: ${game.titleCase(filterOptions[0])}`,
              function: async () => {
                filterOptions.push(filterOptions.shift());
                switch (filterOptions[0]) {
                  case "current weapon":
                    attacks = await player.getActions({
                      type: "weapon_attack",
                      onlyAvailable: true,
                    });
                    break;
                  case "all":
                    attacks = await player.getActions({ type: "weapon_attack" });
                    break;
                }
                m.refresh();
              },
            },
          ],
        },
      ],
      messages: [
        {
          name: "attacks",
          function: async (m) => {
            let titlePrefix: string;
            switch (filterOptions[0]) {
              case "current weapon":
                titlePrefix = game.titleCase(
                  (await player.getEquipped("hand"))?.weaponType || "unarmed"
                );
                break;
              case "all":
                titlePrefix = "All";
                break;
            }
            const title = `${titlePrefix} Attacks`;
            let description = ``;
            for (const attack of attacks) {
              const isCooldown = attack.remCooldown > 0;
              const attackName = isCooldown ? `${attack.getName()}` : `**${attack.getName()}**`;
              const cooldownText = isCooldown ? ` ⏳\`${attack.remCooldown} turns remaining\`` : ``;
              const damageText = `(${attack.getBriefDamageText({
                useEmojis: true,
                useFormatting: true,
              })})`;
              description += `
${attack.getEmoji()} ${attackName} ${isCooldown ? cooldownText : damageText}`;
            }

            return game.fastEmbed({
              player,
              title,
              description,
              fullSend: false,
              reply: true,
            });
          },
        },
      ],
    });

    // List attacks
    if (!attackName) {
      menu.init("attacks");
    }
    // Perform attack
    else {
      // Check if player can attack
      if (!player.canTakeAction)
        return game.error({ player, content: `you can't attack right now.` });

      // Fetch attack
      let attack = await player.getAction(attackName);

      // Check if enemy provided
      if (!targets[1] && attack.outcomes.some((x) => x.targetType !== "all"))
        return game.error({
          player,
          content: `provide the name or number of the enemy you want to attack.`,
        });

      // Check if attack is on cooldown
      if (attack?.remCooldown > 0) {
        return game.error({
          player,
          content: `this attack is still on cooldown!\n${game.f(
            attack.remCooldown
          )} turns remaining.`,
        });
      }

      // Check if enough targets provided
      if (
        !targets[attack.getRequiredTargets()] &&
        attack.outcomes.some((x) => x.targetType !== "all")
      ) {
        return game.error({
          player,
          content: `this attack requires that you choose **${attack.getRequiredTargets()}** targets.`,
        });
      }

      // Check if targeting dead
      if ([target_one, target_three, target_three].some((x) => x?.dead)) {
        return game.error({
          player,
          content: `you can't target dead enemies.`,
        });
      }

      // Notify encounter of player action
      game.emitPlayerAction({ player });

      // Evaluate attack
      const evaluatedAction = await game.evaluateAction({
        action: attack,
        enemies,
        source: player,
        targets,
      });
      if (evaluatedAction.enemies) Object.assign(enemies, evaluatedAction.enemies);
      // if (evaluatedAction.players) Object.assign(players, evaluatedAction.players);

      if (attack.cooldown) {
        // Update remaining cooldown
        attack = await attack.update({ remCooldown: attack.cooldown + 1 });
      }

      // Send emitter
      game.emitter.emit("playerActionComplete", {
        encounterId: player.encounterId,
        player,
        enemies,
      } satisfies PlayerActionCompleteEmitter);

      // Give skill xp
      for (const weaponType of attack.requiredWeapon) {
        await player.giveSkillXP({
          skillName: weaponType + " combat",
          amount: game.random(config.skillXpPerAction[0], config.skillXpPerAction[1]),
        });
      }
    }
  },
} as Command;
