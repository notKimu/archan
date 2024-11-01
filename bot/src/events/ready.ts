import { Client, Events } from "discord.js";
import { BotEvent } from "../types";
import { logError, logSuccex } from "../utils/console";
import redisClient from "../db/redis";

const event: BotEvent = {
    name: Events.ClientReady,
    once: true,

    execute: async (client: Client) => {
        await redisClient.connect().then(() => {
            logSuccex("Connected to Redis!");
        });

        // Handle unhandled rejections
        process.on("unhandledRejection", (reason) => {
            logError("Unhandled Rejection >>=\n" + reason);
            return;
        });

        // Handle uncaught exceptions
        process.on("uncaughtException", (err) => {
            logError("Uncaught Exception >>=\n" + err + "\n\n" + err.stack);
            return;
        });

        client.user?.setActivity("yay -Syuu");
        logSuccex(client.user?.username + " logged in.");
    },
};

export default event;
