import {
    PermissionFlagsBits,
    SlashCommandBuilder,
  } from "discord.js";
  import { SlashCommand } from "../../types";
  import { getGuildData, saveGuildData } from "../../db/functions";
import { cooldowns } from "../../utils/defaults";
  
  const command: SlashCommand = {
    command: new SlashCommandBuilder()
      .setName("set-reward-title")
      .setNameLocalizations({ "es-ES": "titulo-recompensa" })
      .setDescription("Set the title of the reward message!")
      .setDescriptionLocalizations({ "es-ES": "Pon el título del mensaje al conseguir un rol!" })
      .addStringOption((option) =>
        option
          .setName("title")
          .setNameLocalizations({ "es-ES": "titulo" })
          .setDescription("What title do you want?")
          .setDescriptionLocalizations({ "es-ES": "Que título quieres?" })
          .setMinLength(3)
          .setMaxLength(50)
          .setRequired(true)
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    execute: async (interaction) => {
      const { guild, options } = interaction;
      const message: string = options.getString("title")!;
      if (!message) return interaction.reply({ content: "Wohoho, I didn't receive enough parameters to run this command!", ephemeral: true });
  
      const guildData = await getGuildData(guild.id);
      guildData.rewardEmbedTitle = message;
  
      await saveGuildData(guild.id, { ...guildData });
  
      interaction.reply({
        content: `Aha! Now title of the embed I will send when someone gets a reward will be:\n> ${message}`,
        ephemeral: true,
      });
    },
    cooldown: cooldowns.levels,
  };
  
  export default command;
  