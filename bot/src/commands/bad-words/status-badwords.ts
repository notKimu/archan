import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../types";
import { cooldowns } from "../../utils/defaults";
import { getBadWords, getWhitelistedRoles } from "../../db/functions";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("status-badwords")
        .setNameLocalizations({ "es-ES": "estado-palabras-prohibidas" })
        .setDescription("See the words blocked in the server")
        .setDescriptionLocalizations({ "es-ES": "Mira las palabras bloqueadas en el servidor" })
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    execute: async (interaction) => {
        const { guild } = interaction;

        const words = await getBadWords(guild.id);
        const roles = await getWhitelistedRoles(guild.id);
        words ? 
            interaction.reply({ content: "This are the words blocked in the server:\n> " + words.map(w => " **" + w + "**") + "\n_ _\nAnd the persons which can manage messages or which top role is one of this can say them:\n> " + (roles ? roles.map(r => "<@&" + r + "> ") : "**No roles are set!**"), ephemeral: true }) : 
            interaction.reply({ content: "I don't find any blocked words in the server...", ephemeral: true });
    },
    cooldown: cooldowns.moderationNotVital,
};

export default command;
