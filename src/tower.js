import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { IntentsBitField, Client } from "discord.js";

import * as functions from "./functions/index.js";
import * as configOptions from "./config.js";

export const game = functions;
export const config = configOptions;
export const prisma = new PrismaClient();
/** @type {*} */
export const client = new Client({ intents: new IntentsBitField(36363) });
