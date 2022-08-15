import enemies from "../../game/classes/enemies.js";

export default {
  startEnemyEncounter: async (
    message,
    prisma,
    config,
    player,
    game,
    server,
    client
  ) => {
    // Get player region
    const region = player.getRegion();

    // Get all enemies on the current floor
    const floorEnemies = region.enemies;

    // Select enemy randomly based on weights
    const chosenEnemy = game.getWeightedArray(floorEnemies);

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
    let embed = {
      color: config.botColor,
      author: {
        name: `${enemyData.getName()} has appeared!`,
        icon_url: player.pfp,
      },
      description: description,
    };

    if (image) embed.thumbnail = { url: `attachment://${image.name}` };

    // Format buttons
    let buttons = [
      {
        id: "attack",
        label: "Attack",
        style: "secondary",
        function: async (reply, i) => {
          await attack(i);
        },
      },
      {
        id: "flee",
        label: "Flee",
        style: "secondary",
        function: async (reply, i) => {
          await i.update({ components: [] });
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
          i.deferUpdate();
        },
      },
    ];
    // Format action row
    let row = game.actionRow("buttons", buttons);

    // Send embed
    const reply = await game.sendEmbed(message, embed, image, [row]);

    // Create enemy in database
    const enemy = await prisma.enemy.create({
      data: {
        name: enemyData.name,
        health: enemyData.maxHealth,
        fighting: player.discordId,
      },
    });

    // Add new enemy to player explored
    await player.addExplore(
      message,
      server,
      "enemy",
      undefined,
      enemyData.name
    );

    // Unlock new commands
    await player.unlockCommands(message, server, [
      "attack",
      "flee",
      "enemyinfo",
    ]);

    // Enter combat
    await player.enterCombat(enemy);

    // Fetch response from button
    await game.componentCollector(message, reply, buttons);

    // Edit embed with enemyinfo
    async function enemyInfo() {
      player = await player.refresh(message, game);
      const { embed, image } = await game.enemyInfo(config, player, game);
      await reply.edit({ embeds: [embed], files: [image] });

      const index = buttons.findIndex((obj) => obj.id == "enemyinfo");
      buttons[index].disable = true;

      row = game.actionRow("buttons", buttons);

      await reply.edit({ components: [row] });
    }

    // Run flee command
    function flee() {
      game.runCommand("flee", client, message, [], prisma, game, server);
    }

    // Attack component
    async function attack(i) {
      const attackButtons = await createAttackButtons();

      // Create row of attack buttons
      const attackRow = game.actionRow("buttons", attackButtons);

      // Update message
      await i.update({ components: [attackRow] });

      // Create new component collector
      await game.componentCollector(message, reply, attackButtons);

      // Function to perform attack
      async function performAttack(attack) {
        // Perform attack command
        return await game.runCommand(
          "attack",
          client,
          message,
          [attack.name],
          prisma,
          game,
          server
        );
      }

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
            style: "secondary",
            disable: disable,
            function: async (reply, i) => {
              // Perform attack when button is pressed
              const results = await performAttack(attack);
              console.log(results);
              // Check if enemy or player idead and update components
              if (results == "KILLED_ENEMY" || results == "KILLED_PLAYER") {
                await i.update({ components: [] });
              } else {
                await i.deferUpdate();
                // Update attack buttons
                await updateAttacks();
              }
            },
          });
        }

        // Create back button
        attackButtons.push({
          id: "back",
          emoji: "↩",
          style: "secondary",
          function: async (reply, i) => {
            // Load original row
            await reply.edit({ components: [row] });
            if (!i.deferred) await i.deferUpdate();
            return;
          },
          stop: true,
        });

        return attackButtons;
      }
    }
  },
};
