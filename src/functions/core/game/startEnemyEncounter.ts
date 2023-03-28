import enemies from "../../../game/_classes/enemies.js";
import { game, config, prisma } from "../../../tower.js";

export default async function startEnemyEncounter(args: {
  message: Message;
  player: Player;
  server: Server;
}) {
  let { player, message, server } = args;

  // Get player region
  const region = player.getRegion();

  // Get all enemies on the current floor
  const floorEnemies = region.enemies;

  // Select enemy randomly based on weights
  const chosenEnemy =
    game.getWeightedArray<typeof floorEnemies[number]>(floorEnemies);

  // Get data from chosen enemy
  const enemyData = enemies.find(
    (x) => x.name == chosenEnemy.name.toLowerCase()
  );

  const image = enemyData.getImage();

  // Format description
  const description = `
\`[ LVL ${enemyData.level} | HP ${enemyData.maxHealth} ]\`  
    
\`${server.prefix}attack | ${server.prefix}flee | ${server.prefix}enemyinfo\``;

  // Create embed for start of encounter
  let embed: Embed = {
    color: config.botColor,
    author: {
      name: `${enemyData.getName()} has appeared!`,
      icon_url: player.pfp,
    },
    description: description,
  };

  if (image) embed.thumbnail = { url: `attachment://${image.name}` };

  // Format buttons
  let buttons: Button[] = [
    {
      id: "attack",
      label: "Attack",
      style: "secondary",
      function: async (reply, i) => {
        await attack();
      },
    },
    {
      id: "flee",
      label: "Flee",
      style: "secondary",
      function: async (reply, i) => {
        await reply.edit({ components: [] });
        flee();
      },
    },
    {
      id: "enemyinfo",
      //label: "Enemy Info",
      emoji: "ℹ",
      style: "secondary",
      function: async (reply, i) => {
        await enemyInfo();
      },
    },
  ];
  // Format action row
  let row = game.actionRow("buttons", buttons);

  // Send embed
  const reply = await game.send({
    message,
    embeds: [embed],
    files: [image],
    components: [row],
  });

  // Create enemy in database
  const enemy = await prisma.enemy.create({
    data: {
      name: enemyData.name,
      health: enemyData.maxHealth,
      fighting: player.discordId,
    },
  });

  // Add new enemy to player explored
  await player.addExploration({
    message,
    server,
    type: "enemy",
    name: enemyData.name,
  });

  // Unlock new commands
  await player.unlockCommands(message, ["attack", "flee", "enemyinfo"]);

  // Enter combat
  await player.enterCombat(enemy);

  // Fetch response from button
  await game.componentCollector(message, reply, buttons);

  // Edit embed with enemyinfo
  async function enemyInfo() {
    player = await player.refresh();
    const { embed, image } = await game.enemyInfo(player);
    if (!embed) return;

    await reply.edit({ embeds: [embed] });

    const index = buttons.findIndex((obj) => obj.id == "enemyinfo");
    buttons[index].disable = true;

    row = game.actionRow("buttons", buttons);

    await reply.edit({ components: [row] });
  }

  // Run flee command
  function flee() {
    game.runCommand("flee", { message, server });
  }

  // Attack component
  async function attack() {
    const attackButtons = await createAttackButtons();

    // Create row of attack buttons
    const attackRow = game.actionRow("buttons", attackButtons);

    // Update message
    await reply.edit({ components: [attackRow] });

    // Create new component collector
    await game.componentCollector(message, reply, attackButtons);

    // Function to perform attack
    async function performAttack(attack) {
      // Perform attack command
      return await game.runCommand("attack", {
        args: [attack.name],
        message,
        server,
      });
    }

    // Update attack buttons
    async function updateAttacks() {
      // Update attacks and cooldowns
      const attackButtons = await createAttackButtons();
      const attackRow = game.actionRow("buttons", attackButtons);
      return await reply.edit({ components: [attackRow] });
    }

    // Function to generate attack buttons
    async function createAttackButtons() {
      let attacks = await player.getAttacks();

      let attackButtons = [];
      // Iterate through player attacks and create buttons
      for (const attack of attacks) {
        // Check if attack is on cooldown
        const disable = attack.remCooldown > 0 ? true : false;

        // Push to array
        attackButtons.push({
          id: attack.name,
          label: game.titleCase(attack.name),
          style: "success",
          disable: disable,
          function: async (reply, i) => {
            // Perform attack when button is pressed
            const results = await performAttack(attack);

            // Check if enemy or player idead and update components
            if (results == "KILLED_ENEMY" || results == "KILLED_PLAYER") {
              await reply.edit({ components: [] });
            } else {
              await updateAttacks();
            }
          },
        });
      }

      // Create back button
      attackButtons.push({
        id: "listattacks",
        emoji: "ℹ",
        style: "secondary",
        function: async (reply, i) => {
          await updateAttacks();
          return await listAttacks();
        },
      });

      // Create back button
      attackButtons.push({
        id: "back",
        emoji: "↩",
        style: "secondary",
        function: async (reply, i) => {
          // Load original row
          await reply.edit({ components: [row] });
          return;
        },
        stop: true,
      });

      return attackButtons;
    }

    async function listAttacks() {
      return await game.runCommand("attack", { message, server });
    }
  }
}
