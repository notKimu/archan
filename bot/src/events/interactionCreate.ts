import { ChatInputCommandInteraction, Events, Interaction } from "discord.js";
import { BotEvent } from "../types";
import { logError } from "../utils/console";

const event: BotEvent = {
    name: Events.InteractionCreate,

    execute: (interaction: Interaction) => {
        if (interaction.isChatInputCommand()) {
            const chatInputInteraction =
                interaction as ChatInputCommandInteraction;
            if (!chatInputInteraction.guild)
                return interaction.reply(
                    "Hey! I can only accept commands in a server... for now at least."
                );

            let command = chatInputInteraction.client.slashCommands.get(
                chatInputInteraction.commandName
            );
            let cooldown = chatInputInteraction.client.cooldowns.get(
                `${chatInputInteraction.commandName}-${interaction.user.username}`
            );
            if (!command) return;
            if (
                command.cooldown &&
                cooldown &&
                chatInputInteraction.member?.user.id !== "504655450655162379"
            ) {
                if (Date.now() < cooldown) {
                    return chatInputInteraction.reply({
                        content: `Hey you! You have to wait ${Math.floor(
                            Math.abs(Date.now() - cooldown) / 1000
                        )} second(s) before using this command again.`,
                        ephemeral: true,
                    });
                }
                chatInputInteraction.client.cooldowns.set(
                    `${chatInputInteraction.commandName}-${chatInputInteraction.user.username}`,
                    Date.now() + command.cooldown * 1000
                );
                setTimeout(() => {
                    chatInputInteraction.client.cooldowns.delete(
                        `${chatInputInteraction.commandName}-${chatInputInteraction.user.username}`
                    );
                }, command.cooldown * 1000);
            } else if (command.cooldown && !cooldown) {
                chatInputInteraction.client.cooldowns.set(
                    `${chatInputInteraction.commandName}-${chatInputInteraction.user.username}`,
                    Date.now() + command.cooldown * 1000
                );
            }

            try {
                command.execute(chatInputInteraction);
            } catch (err) {
                interaction.reply({
                    content: `Critical error >>>\nI had an error executing /${interaction.commandName}, pwease try again later '^^`,
                    ephemeral: true,
                });
                logError(err);
                return;
            }
        } else if (interaction.isAutocomplete()) {
            const command = interaction.client.slashCommands.get(
                interaction.commandName
            );
            if (!command) {
                return logError(
                    `I didn't find any command matching [${interaction.commandName}]`
                );
            }
            try {
                if (!command.autocomplete) return;
                command.autocomplete(interaction);
            } catch (error) {
                logError(error);
            }
        }
    },
};

export default event;
