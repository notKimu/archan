import {
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { SlashCommand } from "../../types";
import { getGuildData, saveGuildData } from "../../db/functions";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("set-message-xp")
    .setNameLocalizations({ "es-ES": "xp-por-mensaje" })
    .setDescription("Set the maximum XP a user can get from a message!")
    .setDescriptionLocalizations({ "es-ES": "Pon la máxima XP que puedo dar por mensaje" })
    .addIntegerOption((option) =>
      option
        .setName("ammount")
        .setNameLocalizations({ "es-ES": "cantidad" })
        .setDescription("How much XP? [1 - 1000]")
        .setDescriptionLocalizations({ "es-ES": "Cuanta XP? [1 - 1000]" })
        .setMaxValue(1000)
        .setMinValue(1)
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  execute: async (interaction) => {
    const { guild, options } = interaction;
    const ammount: number = options.getInteger("ammount")!;
    if (ammount === null) return interaction.reply({ content: "Wohoho, I didn't receive enough parameters to run this command!", ephemeral: true });

    const guildData = await getGuildData(guild.id);

    guildData.maxXpMessage = ammount;

    await saveGuildData(guild.id, { ...guildData });

    interaction.reply({
      content: `All right! Now the maximum XP a member can get from a message is **${ammount}**XP.`,
      ephemeral: true,
    });
  },
  cooldown: 240,
};

export default command;
