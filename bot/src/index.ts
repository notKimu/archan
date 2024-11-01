console.log("_______             ______                ");
console.log("___    |_______________  /_______ _______ ");
console.log("__  /| |_  ___/  ___/_  __ \\  __ `/_  __ \\");
console.log("_  ___ |  /   / /__ _  / / / /_/ /_  / / /");
console.log("/_/  |_/_/    \\___/ /_/ /_/\\__,_/ /_/ /_/ ");

console.log("");

/* ----------------------------------------------- */

import { Client, GatewayIntentBits, Collection } from "discord.js";
const { Guilds, MessageContent, GuildMessages, GuildMembers } =
    GatewayIntentBits;
const client = new Client({
    intents: [Guilds, MessageContent, GuildMessages, GuildMembers],
});
import { Command, SlashCommand } from "./types";
import { readdirSync } from "fs";
import { join } from "path";

if (!process.env.TOKEN || !process.env.CLIENT_ID) {
    throw console.error(
        "`TOKEN` or `CLIENT_ID` are missing from the environment variables!"
    );
}

global.__basedir = __dirname;

client.slashCommands = new Collection<string, SlashCommand>();
client.commands = new Collection<string, Command>();
client.cooldowns = new Collection<string, number>();

const handlersDir = join(__dirname, "./handlers");
readdirSync(handlersDir).forEach((handler) => {
    require(`${handlersDir}/${handler}`).execute(client);
});

client.login(process.env.TOKEN);
