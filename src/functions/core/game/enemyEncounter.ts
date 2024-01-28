import enemies from "../../../game/_classes/enemies.js";
import { game, config, prisma } from "../../../tower.js";

export default async function enemyEncounter(args: { player: Player }) {
  let { player } = args;

  // Get player region
  const region = player.getRegion();

  // Get all enemies on the current floor
  const floorEnemies = region.enemies;

  // Pick number of enemies to spawn
  let numberOfEnemies = game.random(1, 3);
  if (player.party) {
    numberOfEnemies += Math.floor(player.party.players.length / 2);
    numberOfEnemies = Math.min(numberOfEnemies, 4);
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

  // Create menu
  const menu = new game.Menu({
    player,
    boards: [
      { name: "encounter", message: "encounter", rows: ["encounterOptions"] },
      { name: "info", message: "info", rows: ["encounterOptions"] },
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
                await m.botMessage.delete();
                await enterCombat();
              },
            },
            {
              id: "flee",
              label: "Flee",
              emoji: "💨",
              function: async () => {
                await m.botMessage.delete();
                const botMessage = await game.send({
                  player,
                  content: `You ran away from the encounter!`,
                  reply: true,
                });
                await game.commandButton({
                  player,
                  botMessage,
                  commands: [{ name: "explore" }],
                });
              },
            },
            {
              id: "info",
              emoji: config.emojis.info,
              disable: m.currentBoard == "info" ? true : false,
              function: () => {
                m.switchBoard("info");
              },
            },
          ];
        },
      },
    ],
    messages: [
      {
        name: "encounter",
        function: (m) =>
          game.fastEmbed({
            send: false,
            player: m.player,
            description: ``,
            title: `Some enemies have appeared!`,
            files: [image],
            embed: { image: { url: "attachment://encounter.png" } },
          }),
      },
      {
        name: "info",
        function: async (m) =>
          await game.enemyInfo({
            message: player.message,
            player: m.player,
            enemyData: enemies[0],
          }),
      },
    ],
  });

  menu.init("encounter");

  // Unlock new commands
  await player.unlockCommands(["attack", "flee", "enemyinfo", "invite"]);

  // Enter combat
  async function enterCombat() {
    await game.enterCombat({ player, enemies });
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
  //             if (results == "KILLED_ENEMY" || results == "KILLED_PLAYER") {
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
