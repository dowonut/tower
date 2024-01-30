import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { IntentsBitField, Client } from "discord.js";

import * as functions from "./functions/core/index.js";
import * as configData from "./config.js";
import emojis from "./emojis.js";
export * as playerFunctions from "./functions/player/index.js";

const baseGame = functions;
export const game = baseGame;
let configObject = { ...configData, emojis: emojis };
export const config = configObject;

export const prisma = new PrismaClient().$extends({});

const discordClient = new Client({ intents: new IntentsBitField(36363) });
export const client: TowerClient = discordClient;
