import { prisma, game, config } from "../../tower.js";
import { Prisma } from "@prisma/client";

/** Update player info in database and return new object. */
export default (async function (
  args: Prisma.PlayerUncheckedUpdateInput | Prisma.PlayerUpdateInput
) {
  const playerData = await prisma.player.update({
    where: { id: this.id },
    data: args,
    include: config.playerInclude,
  });

  return Object.assign(this, playerData);
  // return await game.getPlayer({
  //   message: this.message,
  //   channel: this.channel,
  //   server: this.server,
  //   discordId: this.user.discordId,
  // });
} satisfies PlayerFunction);
