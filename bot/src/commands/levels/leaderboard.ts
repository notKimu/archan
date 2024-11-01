import {
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { SlashCommand } from "../../types";
import {
  getLeaderboard,
  getUserRanking,
} from "../../db/functions";
import { getGuildIcon, guildFooter } from "../../utils/defaults/guild";
import { cooldowns } from "../../utils/defaults";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("ranking")
    .setNameLocalizations({ "es-ES": "clasificacion" })
    .setDescription("See top 10 users with most level and XP!")
    .setDescriptionLocalizations({ "es-ES": "Mira a los 10 miembros con más XP!" }),
  execute: async (interaction) => {
    const { guild, member } = interaction;

    const leaderboard = await getLeaderboard(guild.id, 11);
    const userRanking = await getUserRanking(guild.id, member.user.id);

    const rankingEmbed = new EmbedBuilder()
      .setTitle(`${guild.name}'s Ranking`)
      .setDescription(
        leaderboard.map((member) => {
           return `> <@${member.value}> >> **${Math.floor(Math.floor(member.score))}XP**\n`}).join("") +
          `* Your position: ${userRanking}`
      )
      .setColor(guild.roles.highest.color)
      .setThumbnail(getGuildIcon(guild, 1024))
      .setFooter(guildFooter(guild, "Leaderboard"));
    interaction.reply({ embeds: [rankingEmbed] });
  },
  cooldown: cooldowns.levelsUser,
};

export default command;
