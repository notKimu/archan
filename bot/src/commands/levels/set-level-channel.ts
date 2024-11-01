import { Channel, ChannelType, PermissionFlagsBits, SlashCommandBuilder, TextChannel } from "discord.js";
import { SlashCommand } from "../../types";
import { getGuildData, saveGuildData } from "../../db/functions";
import { cooldowns } from "../../utils/defaults";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("set-level-channel")
    .setNameLocalizations({ "es-ES": "canal-niveles" })
    .setDescription("Set the channel where you want me to send level up messages!")
    .setDescriptionLocalizations({ "es-ES": "Donde envio los mensaje de nivelación?" })
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
    const channel: TextChannel = options.getChannel("channel")!;
    if (!channel) return interaction.reply({ content: "Wohoho, I didn't receive enough parameters to run this command!", ephemeral: true });

    const guildData = await getGuildData(guild.id);

    guildData.levelChannel = channel.id;

    await saveGuildData(guild.id, { ...guildData });

    interaction.reply({
      content: `Done! Now I will send the level up messages to <#${channel.id}>`,
      ephemeral: true,
    });
  },
  cooldown: cooldowns.levels,
};

export default command;
