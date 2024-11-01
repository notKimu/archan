import { Channel, ChannelType, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../types";
import { getGuildData, saveGuildData } from "../../db/functions";
import { cooldowns } from "../../utils/defaults";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("remove-no-xp-channel")
    .setNameLocalizations({ "es-ES": "activar-xp-canal" })
    .setDescription("I will give XP again in this channel!")
    .setDescriptionLocalizations({ "es-ES": "Volveré a dar XP en este canal!" })
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
    const channel: Channel = options.getChannel("channel")! as Channel;
    if (!channel) return interaction.reply({ content: "Wohoho, I didn't receive enough parameters to run this command!", ephemeral: true });

    const guildData = await getGuildData(guild.id);

    if (!guildData.noXpChannels.includes(channel.id))
      return interaction.reply({
        content: `Hey! The channel <#${channel.id}> is not in the "no XP" list. >:c`,
        ephemeral: true,
      });

    guildData.noXpChannels = guildData.noXpChannels.filter(channelID => channelID !== channel.id);

    await saveGuildData(guild.id, { ...guildData });

    interaction.reply({
      content: `Hooray! Now I will give XP again in the channel <#${channel.id}>`,
      ephemeral: true,
    });
  },
  cooldown: cooldowns.levels,
};

export default command;
