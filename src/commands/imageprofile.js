import { createCanvas, loadImage } from "canvas";
import { MessageAttachment } from "discord.js";

export default {
  name: "imageprofile",
  description: "Work in progress!",
  aliases: ["ip", "ipr"],
  //  category: "General",
  useInCombat: true,
  async execute(message, args, prisma, config, player, game, server) {
    // update user info if outdated
    if (
      player.username !== message.author.username ||
      player.discriminator !== message.author.discriminator
    ) {
      await game.updateInfo(message.author, player);
    }

    // create author variable
    let auth = message.author;

    if (args[0] && args[0].startsWith("<@")) {
      const user = message.mentions.users.first();

      // fetch player data when pinging
      if (user) {
        const playerInfo = await player.prisma.player.findUnique({
          where: { discordId: user.id },
        });
        auth = user;

        if (playerInfo) player = playerInfo;
        else return message.channel.send(":x: This user has no character.");
      }
    }

    await auth.fetch();
    console.log(auth);

    // Check if player is currently in combat
    if (player.inCombat == true) {
    }

    // Check if player has unused stat points
    if (player.statpoints > 0) {
    }

    const width = 500;
    const height = 300;
    const path = "./assets/profile/";
    //const imageName = "test2.png";

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    const base = await loadImage(path + "base.png");
    ctx.drawImage(base, 0, 0, width, height);

    ctx.globalCompositeOperation = "source-atop";

    const bannerUrl = await auth.bannerURL({
      dynamic: false,
      format: "png",
      size: 1024,
    });

    const banner = await loadImage(bannerUrl);
    //const banner = await loadImage(path + "banner.png");
    const imageHeight = (width / banner.width) * banner.height;
    const imageY = -imageHeight / 2 + 40;
    ctx.drawImage(banner, 2, imageY, width, imageHeight);

    const baseTop = await loadImage(path + "basetop.png");
    ctx.drawImage(baseTop, 0, 0, width, height);

    const image = canvas.toBuffer();

    const attachment = new MessageAttachment(image, "test.png");

    // const embed = {
    //   image: { url: "attachment://test.png" },
    //   color: config.botColor,
    // };

    // message.channel.send({ embeds: [embed], files: [attachment] });
    message.channel.send({ files: [attachment] });
  },
};
