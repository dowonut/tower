import enemies from "../../../game/_classes/enemies.js";
import { game, config, prisma } from "../../../tower.js";

export default async function enemyEncounter(args: { message: Message; player: Player; server: Server }) {
  let { player, message, server } = args;

  // Get player region
  const region = player.getRegion();

  // Get all enemies on the current floor
  const floorEnemies = region.enemies;

  // Select enemy randomly based on weights
  const chosenEnemy = game.getWeightedArray<(typeof floorEnemies)[number]>(floorEnemies);

  // Get enemy
  const enemyData = game.getEnemy(chosenEnemy.name);

  // Get image
  const image = enemyData.getImage();

  // Create menu
  const menu = new game.Menu({
    player,
    message,
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
              function: () => {
                m.botMessage.delete();
                enterCombat();
              },
            },
            {
              id: "flee",
              label: "Flee",
              emoji: "💨",
              function: async () => {
                m.botMessage.delete();
                const reply = await game.send({
                  message,
                  content: `You ran away from **${enemyData.getName()}**!`,
                  reply: true,
                });
                game.commandButton({
                  message,
                  reply,
                  server,
                  command: "explore",
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
            message: m.message,
            description: `
*${enemyData.description}*

Level: **\`${enemyData.level}\`**
${game.fastProgressBar("health", enemyData)}`,
            title: `${enemyData.getName()} has appeared!`,
            thumbnail: image ? `attachment://${image.name}` : null,
            files: image ? [image] : [],
          }),
      },
      {
        name: "info",
        function: async (m) =>
          await game.enemyInfo({
            message: m.message,
            player: m.player,
            enemyData,
          }),
      },
    ],
  });

  menu.init("encounter");

  // Add new enemy to player explored
  await player.addExploration({
    message,
    server,
    type: "enemy",
    name: enemyData.name,
  });

  // Unlock new commands
  await player.unlockCommands(message, ["attack", "flee", "enemyinfo", "invite"]);

  // Enter combat
  function enterCombat() {
    game.enterCombat({ player, enemies: [enemyData], message });
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
