import { Channel, ChannelType, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../types";
import { getGuildData, saveGuildData } from "../../db/functions";
import { cooldowns } from "../../utils/defaults";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("set-no-xp-channel")
    .setNameLocalizations({ "es-ES": "añadir-canal-sin-xp" })
    .setDescription("Make me stop giving XP in a specific channel!")
    .setDescriptionLocalizations({ "es-ES": "Haz que deje de dar XP en este canal!" })
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setNameLocalizations({ "es-ES": "canal" })
        .setDescription("What channel?")
        .setDescriptionLocalizations({ "es-ES": "Que canal?" })
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  execute: async (interaction) => {
    const { guild, options } = interaction;
    const channel: Channel = options.getChannel("channel")!;
    if (!channel) return interaction.reply({ content: "Wohoho, I didn't receive enough parameters to run this command!", ephemeral: true });

    const guildData = await getGuildData(guild.id);
    guildData.noXpChannels.push(channel.id);

    await saveGuildData(guild.id, { ...guildData });

    interaction.reply({
      content: `Hooray! Now I won't give XP in the channel <#${channel.id}>`,
      ephemeral: true,
    });
  },
  cooldown: cooldowns.levels,
};

export default command;
