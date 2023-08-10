import { game } from "../../tower.js";

/** Run a command. */
export default (async function (obj: { name: string; args?: string[] }) {
  const { name, args = [] } = obj;
  return await game.runCommand(name, {
    message: this.message,
    channel: this.channel,
    server: this.server,
    args,
    discordId: this.user.discordId,
  });
} satisfies PlayerFunction);
