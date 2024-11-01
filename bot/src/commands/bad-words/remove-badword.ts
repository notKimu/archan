import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../types";
import { cooldowns } from "../../utils/defaults";
import { removeBadWord } from "../../db/functions";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("remove-badword")
        .setNameLocalizations({ "es-ES": "quitar-palabra-prohibida" })
        .setDescription("Make me stop deleting messages with that word")
        .setDescriptionLocalizations({ "es-ES": "Hazme dejar de borrar una palabra bloqueada" })
        .addStringOption(option => option
            .setName("word")
            .setNameLocalizations({ "es-ES": "palabra" })
            .setDescription("The word you want to unblock ")
            .setDescriptionLocalizations({ "es-ES": "Palabra que desbloquear" })
            .setMinLength(3)
            .setMaxLength(20)
            .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    execute: async (interaction) => {
        const { guild, options } = interaction;
        const word: string = options.getString("word")!;
        if (!word) return interaction.reply({ content: "Wohoho, I didn't receive enough parameters to run this command!", ephemeral: true });

        await removeBadWord(guild.id, word) === 1 ? 
            interaction.reply({ content: "Naisu! Now the word `" + word + "` will no longer be deleted!", ephemeral: true }) : 
            interaction.reply({ content: "Hmmmm I don't think I was blocking that word :?", ephemeral: true });
    },
    cooldown: cooldowns.moderation,
};

export default command;
