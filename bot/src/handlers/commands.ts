import { Client, Routes, SlashCommandBuilder } from "discord.js";
import { REST } from "@discordjs/rest";
import { readdirSync } from "fs";
import { join } from "path";
import { SlashCommand } from "../types";
import { logError, logInfo } from "../utils/console";
import paths from "../utils/paths";

function readCommands(client: Client): SlashCommandBuilder[] {
    const commands: SlashCommandBuilder[] = [];

    readdirSync(paths.COMMANDS).forEach((subFolder) => {
        if (subFolder.includes(".js")) return;
        console.log("> [Module] " + subFolder);

        const commandsSubDir = join(paths.COMMANDS, subFolder);
        readdirSync(commandsSubDir).forEach((file) => {
            let command: SlashCommand =
                require(`${paths.COMMANDS}/${subFolder}/${file}`).default;

            commands.push(command.command);
            client.slashCommands.set(command.command.name, command);
        });
    });

    return commands;
}

module.exports = {
    execute: (client: Client) => {
        logInfo("Loading commands >>>");

        const commands = readCommands(client);

        const rest = new REST({ version: "10" }).setToken(process.env.TOKEN!);

        rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), {
            body: commands.map((command) => command.toJSON()),
        })
            .then((data: any) => {
                logInfo(`Loaded ${data.length} slash commands -w-`);
            })
            .catch((err) => {
                logError(err);
            });
    },
    readCommands: readCommands
}
