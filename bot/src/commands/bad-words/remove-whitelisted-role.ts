import { PermissionFlagsBits, Role, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../types";
import { cooldowns } from "../../utils/defaults";
import { removeWhitelistedRole } from "../../db/functions";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("remove-whitelist-role")
        .setNameLocalizations({ "es-ES": "prohibir-palabras-rol" })
        .setDescription("Stop allowing sending banned words to this role!")
        .setDescriptionLocalizations({ "es-ES": "Prohíbe las palabras prohibidas a este rol" })
        .addRoleOption(option => option
            .setName("role")
            .setNameLocalizations({ "es-ES": "rol" })
            .setDescription("To what role you want to forbid the words?")
            .setDescriptionLocalizations({ "es-ES": "A que rol quieres prohibir las palabras?" })
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
    
        const blacklistRole = await removeWhitelistedRole(guild.id, role.id);
        blacklistRole === 1 ?
          interaction.reply({ content: "Got it! Now the role <@&" + role + "> wont be able to write the banned words!", ephemeral: true }):
          interaction.reply({ content: "Oops! Is that role really whitelisted? Check it with `/get-badwords`", ephemeral: true })
    
    },
    cooldown: cooldowns.moderation,
};

export default command;