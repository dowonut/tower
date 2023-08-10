import { prisma, game } from "../../tower.js";
import { Prisma } from "@prisma/client";

/** Update player info in database and return new object. */
export default (async function (args: Prisma.PlayerUncheckedUpdateInput | Prisma.PlayerUpdateInput) {
  await prisma.player.update({ where: { id: this.id }, data: args });

  return await game.getPlayer({
    message: this.message,
    channel: this.channel,
    server: this.server,
    discordId: this.user.discordId,
  });
} satisfies PlayerFunction);
