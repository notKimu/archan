import { SlashCommandBuilder, CommandInteraction, Collection, PermissionResolvable, Message, AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js"

declare global {
    var __basedir: string;
}

type GuildedInteraction = ChatInputCommandInteraction<CacheType> & {
    guild: NonNullable<ChatInputCommandInteraction<CacheType>['guild']>;
    member: NonNullable<ChatInputCommandInteraction<CacheType>['member']>;
};

export interface SlashCommand {
    command: SlashCommandBuilder | any,
    execute: (interaction : GuildedInteraction) => void,
    autocomplete?: (interaction: AutocompleteInteraction) => void,
    cooldown?: number // in seconds
}

export interface Command {
    name: string,
    execute: (message: Message, args: Array<string>) => void,
    permissions: Array<PermissionResolvable>,
    aliases: Array<string>,
    cooldown?: number,
}

interface GuildOptions {
    prefix: string,
}

export type GuildOption = keyof GuildOptions
export interface BotEvent {
    name: string,
    once?: boolean | false,
    execute: (...args?) => void
}

declare module "discord.js" {
    export interface Client {
        slashCommands: Collection<string, SlashCommand>
        commands: Collection<string, Command>,
        cooldowns: Collection<string, number>
    }
}