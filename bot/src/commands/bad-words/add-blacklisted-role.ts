import { PermissionFlagsBits, Role, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../types";
import { cooldowns } from "../../utils/defaults";
import { addWhitelistedRole } from "../../db/functions";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("add-whitelist-role")
        .setNameLocalizations({ "es-ES": "permitir-palabras-rol" })
        .setDescription("Allow banned words to this role!")
        .setDescriptionLocalizations({ "es-ES": "Permite las palabras prohibidas a este rol" })
        .addRoleOption(option => option
            .setName("role")
            .setNameLocalizations({ "es-ES": "rol" })
            .setDescription("To what role you want to allow the words?")
            .setDescriptionLocalizations({ "es-ES": "A que rol quieres permitir las palabras?" })
            .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    execute: async (interaction) => {
        const { guild, member, options } = interaction;
        const role: Role = options.getRole("role")!;
        if (!role) return interaction.reply({ content: "Wohoho, I didn't receive enough parameters to run this command!", ephemeral: true });
    
        if (role.position >= guild.members.me!.roles.highest.position) {
          return interaction.reply({
            content: "Hey! I can't manage messages from people with that role! Is higher than mine.",
            ephemeral: true,
          });
        } else if (role.position >= member.roles.highest.position) {
          return interaction.reply({
            content:  "Stop right there! You can't manage messages from a role higher or equal to yours :!",
            ephemeral: true,
          });
        }
    
        const whitelistRole = await addWhitelistedRole(guild.id, role.id);
        whitelistRole ?
          interaction.reply({ content: "Got it! Now the role <@&" + role + "> can write the banned words!", ephemeral: true }):
          interaction.reply({ content: "Oops! Is that role already whitelisted? Check `/get-badwords`", ephemeral: true })
    
    },
    cooldown: cooldowns.moderation,
};

export default command;