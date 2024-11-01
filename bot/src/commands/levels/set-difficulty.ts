import {
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { SlashCommand } from "../../types";
import { getGuildData, saveGuildData } from "../../db/functions";
import { cooldowns } from "../../utils/defaults";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("set-difficulty")
    .setNameLocalizations({ "es-ES": "dificultad" })
    .setDescription("Set how much the difficulty increases for each level [1.1 default]!")
    .setDescriptionLocalizations({ "es-ES": "Por cuanto multiplico la dificultad cada nivel? [1.1 default]" })
    .addNumberOption((option) =>
      option
        .setName("ammount")
        .setNameLocalizations({ "es-ES": "cantidad" })
        .setDescription("How difficult do you want it [1.1 default]?")
        .setDescriptionLocalizations({ "es-ES": "Que tan dificil? [1.1 default]" })
        .setMaxValue(2.5)
        .setMinValue(1)
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  execute: async (interaction) => {
    const { guild, options } = interaction;
    const ammount: number = options.getInteger("ammount")!;
    if (ammount === null) return interaction.reply({ content: "Wohoho, I didn't receive enough parameters to run this command!", ephemeral: true });

    const guildData = await getGuildData(guild.id);

    guildData.difficulty = ammount;

    await saveGuildData(guild.id, { ...guildData });

    interaction.reply({
      content: `All right! Now the difficulty will increase **${ammount}** time(s) for each level.`,
      ephemeral: true,
    });
  },
  cooldown: cooldowns.levels,
};

export default command;
