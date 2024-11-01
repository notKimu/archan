import { PermissionFlagsBits, Role, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../types";
import { getGuildData, saveGuildData } from "../../db/functions";
import { cooldowns } from "../../utils/defaults";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("add-reward")
        .setNameLocalizations({ "es-ES": "añadir-recompensa" })
        .setDescription("Set a role to give when a user gets to a level!")
        .setDescriptionLocalizations({
            "es-ES": "Da un rol al llegar a un nivel!",
        })
        .addIntegerOption((option) =>
            option
                .setName("level")
                .setNameLocalizations({ "es-ES": "nivel" })
                .setDescription(
                    "At what level do you want me to give the role?"
                )
                .setDescriptionLocalizations({
                    "es-ES": "En que nivel quiere dar el rol?",
                })
                .setMaxValue(1000)
                .setMinValue(1)
                .setRequired(true)
        )
        .addRoleOption((option) =>
            option
                .setName("role")
                .setNameLocalizations({ "es-ES": "rol" })
                .setDescription("The role you want to give!")
                .setDescriptionLocalizations({
                    "es-ES": "Que rol quieres dar?",
                })
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    execute: async (interaction) => {
        const { guild, options } = interaction;
        const level: number = options.getInteger("level")!;
        const role: Role = interaction.options.getRole("role")! as Role;
        if (level === null || !role)
            return interaction.reply({
                content:
                    "Wohoho, I didn't receive enough parameters to run this command!",
                ephemeral: true,
            });

        if (
            !guild.members.me?.roles.highest.position ||
            role.position > guild.members.me.roles.highest.position
        ) {
            return await interaction.reply({
                content:
                    "Looks like I can't give that role! Is higher than mine in the role manager, could you go and change it?",
                ephemeral: true,
            });
        }

        const guildData = await getGuildData(guild.id);
        if (
            guildData.rewards.find((reward) => {
                return reward.level === level || reward.role === role.id;
            })
        )
            return interaction.reply({
                content:
                    "Hey! There is already a reward configured for level or role.\nYou can check the active rewards with `/status`",
                ephemeral: true,
            });

        guildData.rewards.push({ level: level, role: role.id });

        await saveGuildData(guild.id, { ...guildData });

        interaction.reply({
            content: `Good! Now I will give the role ${role} when someone reaches level **${level}**.`,
            ephemeral: true,
        });
    },
    cooldown: cooldowns.levelsFast,
};

export default command;
