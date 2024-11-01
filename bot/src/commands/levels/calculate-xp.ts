import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../types";
import {
    getGuildData,
    getUserData,
    getXpNeeded,
} from "../../db/functions";
import { guildFooter } from "../../utils/defaults/guild";
import { cooldowns } from "../../utils/defaults";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("calculate-xp")
        .setNameLocalizations({ "es-ES": "calcular-xp" })
        .setDescription("See how much XP you need to get to a level!")
        .setDescriptionLocalizations({
            "es-ES": "Mira cuanta XP necesitas para un nivel!",
        })
        .addIntegerOption((option) =>
            option
                .setName("level")
                .setNameLocalizations({ "es-ES": "nivel" })
                .setDescription("What level do you want to inspect?")
                .setDescriptionLocalizations({
                    "es-ES": "Que nivel quieres inspeccionar?",
                })
                .setMaxValue(1000)
                .setMinValue(1)
                .setRequired(true)
        ),
    execute: async (interaction) => {
        const { guild, member, options, user } = interaction;
        const targetLevel: number = options.getInteger("level")!;
        if (targetLevel === null)
            return interaction.reply({
                content:
                    "Wohoho, I didn't receive enough parameters to run this command!",
                ephemeral: true,
            });

        const { level, xp } = await getUserData(guild.id, user.id);
        const { baseXP, difficulty } = await getGuildData(guild.id);

        const neededXp = getXpNeeded(targetLevel, baseXP, difficulty);
        const currentXp = getXpNeeded(level, baseXP, difficulty) + xp;
        const xpLeft =
            neededXp - currentXp >= 0
                ? (neededXp - currentXp).toFixed(0)
                : "You got there!";

        const calculatedXp = new EmbedBuilder()
            .setTitle(`Level ${targetLevel} information`)
            .setDescription(
                `> XP Needed: **${neededXp.toFixed(0)}**xp
                > XP Left: **${xpLeft}**
                > Your XP: **${currentXp.toFixed(0)}**xp`
            )
            .setColor(member.displayHexColor)
            .setFooter(guildFooter(guild, "Levels"));

        interaction.reply({ embeds: [calculatedXp] });
    },
    cooldown: cooldowns.levelsUser,
};

export default command;
