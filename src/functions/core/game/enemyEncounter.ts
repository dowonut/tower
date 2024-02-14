import _ from "lodash";
import enemies from "../../../game/_classes/enemies.js";
import { game, config, prisma, client } from "../../../tower.js";

export default async function enemyEncounter(args: { player: Player }) {
  let { player } = args;

  // Get player region
  const region = player.getRegion();

  // Get all enemies on the current floor
  const floorEnemies = region.enemies;

  // Adjust enemy weights according to player level
  // console.log("Base weights: ", floorEnemies);
  for (const floorEnemy of floorEnemies) {
    const enemyData = game.getEnemy(floorEnemy.name);
    const levelDifference = Math.max(0, enemyData.level - player.level);
    for (let i = 0; i < levelDifference; i++) {
      // floorEnemy.weight -= 10;
      // floorEnemy.weight = Math.ceil(floorEnemy.weight * 0.5);
      floorEnemies
        .filter((x) => x.name !== floorEnemy.name)
        .forEach((enemy) => {
          enemy.weight *= 2;
        });
    }
    floorEnemy.weight = Math.max(0, floorEnemy.weight);
  }
  while (floorEnemies.some((x) => x.weight > 100)) {
    floorEnemies.forEach((x) => {
      x.weight = Math.ceil(x.weight / 2);
    });
  }
  // console.log("Final adjusted weights: ", floorEnemies);

  // Pick number of enemies to spawn
  let numberOfEnemies = game.random(1, 3);
  if (player.party) {
    numberOfEnemies += Math.floor(player.party.players.length - 1);
    numberOfEnemies = Math.min(numberOfEnemies, 5);
  }

  let enemies: Enemy[] = [];
  for (let i = 0; i < numberOfEnemies; i++) {
    // Choose enemies randomly based on weights
    const chosenEnemy = game.getWeightedArray<(typeof floorEnemies)[number]>(floorEnemies);

    // Get enemy
    const enemyData = game.getEnemy(chosenEnemy.name);

    // Add new enemy to player explored
    player.addExploration({
      type: "enemy",
      name: enemyData.name,
    });

    enemies.push(enemyData);
  }

  // Generate enemy image
  const image = await game.createEncounterImage({ enemies });

  // Check if player already has pre-encounter
  if (player.preEncounter) {
    const message = await game.getDiscordMessage(player.preEncounter);
    if (message) await message.edit({ components: [] });
    game.emitter.removeListener("enterCombat", onEnterCombat);
  }

  // Create menu
  const menu = new game.Menu({
    player,
    boards: [
      { name: "encounter", message: "encounter", rows: ["encounterOptions"] },
      { name: "info", message: "encounter", rows: ["encounterOptions", "selectEnemy"] },
      { name: "end", message: "encounter", rows: [] },
    ],
    rows: [
      {
        name: "encounterOptions",
        type: "buttons",
        components: (m) => {
          return [
            {
              id: "enter_combat",
              label: "Enter Combat",
              style: "primary",
              emoji: "⚔️",
              function: async () => {
                await enterCombat();
              },
            },
            {
              id: "keep_exploring",
              label: "Keep Exploring",
              function: async () => {
                await killPreEncounter();
                await player.runCommand({
                  name: "explore",
                });
              },
            },
            {
              id: "info",
              emoji: config.emojis.info,
              disable: m.currentBoard == "info" ? true : false,
              function: async () => {
                await m.switchBoard("info");
              },
            },
          ];
        },
      },
      {
        name: "selectEnemy",
        type: "menu",
        components: (m) => ({
          id: "selectEnemy",
          placeholder: "Select an enemy to view more information...",
          options: _.uniq(enemies).map((x) => ({
            id: x.name + x.number,
            label: x.getName(),
            value: x.name,
            emoji: x.getEmoji(),
          })),
          function: async (r, i, s) => {
            await game.runCommand("enemyinfo", {
              channel: m.player.channel,
              discordId: m.player.user.discordId,
              server: m.player.server,
              args: [s],
            });
          },
        }),
      },
    ],
    messages: [
      {
        name: "encounter",
        function: (m) =>
          game.fastEmbed({
            fullSend: false,
            reply: true,
            player: m.player,
            description: ``,
            title: `Some enemies have appeared!`,
            files: [image],
            embed: { image: { url: "attachment://encounter.png" } },
          }),
      },
    ],
  });

  await menu.init("encounter");

  // Update player preencounter
  await player.update({
    preEncounter: { messageId: menu.botMessage.id, channelId: menu.botMessage.channelId },
  });

  // Enter combat
  async function enterCombat() {
    await menu.botMessage.delete();
    await player.update({ preEncounter: null });
    await game.enterCombat({ player, enemies });
    game.emitter.removeListener("enterCombat", onEnterCombat);
  }

  // Kill encounter
  async function killPreEncounter() {
    await menu.switchBoard("end");
    await player.update({ preEncounter: null });
    game.emitter.removeListener("enterCombat", onEnterCombat);
  }

  // Enter combat when receive entercombat command
  game.emitter.on("enterCombat", onEnterCombat);
  async function onEnterCombat(args: { playerId: number; messageId: string }) {
    const { playerId, messageId } = args;
    if (playerId !== player.id || menu.botMessage.id !== messageId) return;
    await enterCombat();
  }

  //   // Create enemy in database
  //   const enemy = await prisma.enemy.create({
  //     data: {
  //       name: enemyData.name,
  //       health: enemyData.maxHealth,
  //       fighting: player.user.discordId,
  //     },
  //   });

  //   // Enter combat
  //   await player.enterCombat(enemy);

  //   // Attack component
  //   async function attack() {
  //     const attackButtons = await createAttackButtons();

  //     // Create row of attack buttons
  //     const attackRow = game.actionRow("buttons", attackButtons);

  //     // Update message
  //     await reply.edit({ components: [attackRow] });

  //     // Create new component collector
  //     await game.componentCollector(message, reply, attackButtons);

  //     // Function to perform attack
  //     async function performAttack(attack) {
  //       // Perform attack command
  //       return await game.runCommand("attack", {
  //         args: [attack.name],
  //         message,
  //         server,
  //       });
  //     }

  //     // Update attack buttons
  //     async function updateAttacks() {
  //       // Update attacks and cooldowns
  //       const attackButtons = await createAttackButtons();
  //       const attackRow = game.actionRow("buttons", attackButtons);
  //       return await reply.edit({ components: [attackRow] });
  //     }

  //     // Function to generate attack buttons
  //     async function createAttackButtons() {
  //       let attacks = await player.getAttacks();

  //       let attackButtons = [];
  //       // Iterate through player attacks and create buttons
  //       for (const attack of attacks) {
  //         // Check if attack is on cooldown
  //         const disable = attack.remCooldown > 0 ? true : false;

  //         // Push to array
  //         attackButtons.push({
  //           id: attack.name,
  //           label: game.titleCase(attack.name),
  //           style: "success",
  //           disable: disable,
  //           function: async (reply, i) => {
  //             // Perform attack when button is pressed
  //             const results = await performAttack(attack);

  //             // Check if enemy or player idead and update components
  //             if (results == "KILLED_TARGET" || results == "KILLED_SOURCE") {
  //               await reply.edit({ components: [] });
  //             } else {
  //               await updateAttacks();
  //             }
  //           },
  //         });
  //       }

  //       // Create back button
  //       attackButtons.push({
  //         id: "listattacks",
  //         emoji: "ℹ",
  //         style: "secondary",
  //         function: async (reply, i) => {
  //           await updateAttacks();
  //           return await listAttacks();
  //         },
  //       });

  //       // Create back button
  //       attackButtons.push({
  //         id: "back",
  //         emoji: "↩",
  //         style: "secondary",
  //         function: async (reply, i) => {
  //           // Load original row
  //           await reply.edit({ components: [row] });
  //           return;
  //         },
  //         stop: true,
  //       });

  //       return attackButtons;
  //     }

  //     async function listAttacks() {
  //       return await game.runCommand("attack", { message, server });
  //     }
}
