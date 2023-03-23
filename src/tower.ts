import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { IntentsBitField, Client } from "discord.js";

import * as functions from "./functions/core/index.js";
import * as configOptions from "./config.js";
export * as playerFunctions from "./functions/player/index.js";

const baseGame = functions;
export const game = baseGame;
export const config = configOptions;
export const prisma = new PrismaClient();
const discordClient = new Client({ intents: new IntentsBitField(36363) });
export const client: TowerClient = discordClient;
