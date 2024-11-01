import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../types";
import { cooldowns } from "../../utils/defaults";
import { addBadWord } from "../../db/functions";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("add-badword")
        .setNameLocalizations({ "es-ES": "añadir-palabra-prohibida" })
        .setDescription("Block a word in the chat to the user's you want")
        .setDescriptionLocalizations({ "es-ES": "Bloquea una palabra a ciertos usuarios" })
        .addStringOption(option => option
            .setName("word")
            .setNameLocalizations({ "es-ES": "palabra" })
            .setDescription("The word you want to block ")
            .setDescriptionLocalizations({ "es-ES": "La palabra que quieres bloquear" })
            .setMinLength(3)
            .setMaxLength(20)
            .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    execute: async (interaction) => {
        const { guild, options } = interaction;
        const word: string = options.getString("word")!;
        if (!word) return interaction.reply({ content: "Wohoho, I didn't receive enough parameters to run this command!", ephemeral: true });

        await addBadWord(guild.id, word) ? 
            interaction.reply({ content: "Alr8t! Now the word `" + word + "` is blocked for the users you selected!", ephemeral: true }) : 
            interaction.reply({ content: "Hey! The maximum number of blocked words is 50!!1!", ephemeral: true });
    },
    cooldown: cooldowns.moderation,
};

export default command;
