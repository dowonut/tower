declare global {
  namespace PrismaJson {
    type PrismaPlayerWadrobe = PlayerWardrobe;
    type PrismaEnvironment = Environment;
    type PrismaDiscordMessage = { messageId: string; channelId: string };
  }
}

export {};
