import {
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { SlashCommand } from "../../types";
import { getGuildData } from "../../db/functions";
import { getGuildIcon, guildFooter } from "../../utils/defaults/guild";
import { cooldowns } from "../../utils/defaults";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("status-levels")
    .setNameLocalizations({ "es-ES": "estado-niveles" })
    .setDescription("See the configuration of the levels!")
    .setDescriptionLocalizations({ "es-ES": "Mira la configuración de los niveles!" })
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  execute: async (interaction) => {
    const { guild, member } = interaction;
    const {
      baseXP,
      difficulty,
      levelChannel,
      maxXpMessage,
      rewards,
      noXpChannels,
    } = await getGuildData(guild.id);

    const statusEmbed = new EmbedBuilder()
      .setTitle(`${guild.name}'s level config`)
      .setDescription(
        `> Base XP: **${baseXP}**
        > Message XP: **${maxXpMessage}**
        > Difficulty: **${difficulty}**
        > Rewards: ${rewards.map((reward) =>
          `\n* **Level ${reward.level}** > <@&${reward.role}>`
        ).join("")}\n> No XP channels: ${noXpChannels
          .map((channelID) => `\n* <#${channelID}>`)
          .join("")}\n> Level channel: ${
          levelChannel ? "<#" + levelChannel + ">" : "**Not set.**"
        }`
      )
      .setColor(member.displayHexColor)
      .setThumbnail(getGuildIcon(guild, 1024))
      .setFooter(guildFooter(guild, "Levels"));

    interaction.reply({ embeds: [statusEmbed] });
  },
  cooldown: cooldowns.moderationNotVital,
};

export default command;
