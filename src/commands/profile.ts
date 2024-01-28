import { game, config, prisma, client } from "../tower.js";
import emojis from "../emojis.js";

export default {
  name: "profile",
  description: "Show all relevant information about your character.",
  aliases: ["pr", "p"],
  arguments: [{ name: "user", type: "user", required: false }],
  //  category: "General",
  useInCombat: true,
  async execute(message, args, player, server) {
    if (args.user) {
      player = args.user;
    }

    const { f } = game;

    // define all variables
    const { level, xp, health, maxHP, floor, marks } = player;
    const nextXp = config.nextLevelXp(level);
    const { health: healthE, floor: floorE, mark: markE, blank, side_arrow } = config.emojis;
    const region = game.titleCase(player.getRegion().name);
    const { strength, defense, arcane, vitality } = config.emojis.traits;
    const { strength: ps, defense: pd, arcane: pa, vitality: pv } = player;

    // Format profile
    let description = `
${game.fastProgressBar("xp", player)}
${game.fastProgressBar("health", player)}

${markE} ${f(marks)}
${floorE} ${f(floor)} | ${f(region)}`;

    // Get the player's character image
    const characterImage = await player.getCharacterImage();

    // Add traits
    if (player.level > 0) {
      description += `\n\n${strength} ${f(ps)} ${defense} ${f(pd)} ${arcane} ${f(pa)} ${vitality} ${f(pv)}`;
    }

    // Check if player is currently in combat
    if (player.inCombat == true) description += `\n\n${config.emojis.weapons.sword} **Currently in combat.**`;

    // Check if player has unused trait points
    if (player.traitPoints > 0)
      description += `\n\n${side_arrow} **You have \`${player.traitPoints}\` unassigned trait points!**`;

    // Create embed
    const color = player.user.embed_color;
    const embed: Embed = {
      color: parseInt("0x" + color),
      // author: {
      //   name: player.user.username + "#" + player.user.discriminator,
      // },
      title: `**${player.user.username}'s Profile**`,
      thumbnail: {
        url: player.user.pfp,
      },
      description: description,
      image: {
        url: characterImage ? `attachment://${player.user.discordId}.png` : undefined,
      },
    };

    // Check if player is same as the message author
    const playerIsAuthor = player.user.discordId == message.author.id;
    let sentInventory = false;
    let sentEquipment = false;

    // Send embed
    const botMessage = await game.send({
      player,
      embeds: [embed],
      files: [characterImage],
    });

    let commandButtons: any = [{ name: "inventory" }, { name: "wardrobe" }];
    if (player.traitPoints > 0) commandButtons.unshift({ name: "traits", emoji: emojis.gold_side_arrow });

    await game.commandButton({
      player,
      botMessage,
      commands: commandButtons,
    });
  },
} as Command;
