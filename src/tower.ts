import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { IntentsBitField, Client } from "discord.js";

import * as functions from "./functions/index.js";
import * as configOptions from "./config.js";
import { TowerClient } from "./types/types.js";

export const game = functions;
export const config = configOptions;
export const prisma = new PrismaClient();
const discordClient = new Client({ intents: new IntentsBitField(36363) });
export const client: TowerClient = discordClient;

export * as types from "./types.js";
