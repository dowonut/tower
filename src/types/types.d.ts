import Discord from "discord.js";

export interface TowerClient extends Discord.Client {
  commands?: Discord.Collection<unknown, unknown>;
  cooldowns?: Discord.Collection<unknown, unknown>;
}
