import { prisma, game } from "../../tower.js";
import { Prisma } from "@prisma/client";

/** Update player info in database and return new object. */
export default (async function (args: Prisma.PlayerUpdateInput) {
  await prisma.player.update({ where: { id: this.id }, data: args });

  return await game.getPlayer({
    message: this.message,
    server: this.server,
    discordId: this.discordId,
  });
} satisfies PlayerFunction);
