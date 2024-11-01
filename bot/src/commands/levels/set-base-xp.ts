import {
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { SlashCommand } from "../../types";
import { getGuildData, saveGuildData } from "../../db/functions";
import { cooldowns } from "../../utils/defaults";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("set-base-xp")
    .setNameLocalizations({ "es-ES": "xp-nivel" })
    .setDescription("Set how much XP you need for level 1, which is multiplied by 2 and the difficulty each level!")
    .setDescriptionLocalizations({ "es-ES": "Cuanta xp se necesita para el nivel 1, se multiplica por 2 y la dificultad cada nivel!" })
    .addIntegerOption((option) =>
      option
        .setName("ammount")
        .setNameLocalizations({ "es-ES": "cantidad" })
        .setDescription("How much XP to get to the first level?")
        .setDescriptionLocalizations({ "es-ES": "Cuanta XP para el primer nivel?" })
        .setMaxValue(5000)
        .setMinValue(10)
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  execute: async (interaction) => {
    const { guild, options } = interaction;
    const ammount: number = options.getInteger("ammount")!;
    if (ammount === null) return interaction.reply({ content: "Wohoho, I didn't receive enough parameters to run this command!", ephemeral: true });

    const guildData = await getGuildData(guild.id);

    guildData.baseXP = ammount;

    await saveGuildData(guild.id, { ...guildData });

    interaction.reply({
      content: `All right! Now the base XP (the xp needed for level 1) is **${ammount}**XP.`,
      ephemeral: true,
    });
  },
  cooldown: cooldowns.levels,
};

export default command;
