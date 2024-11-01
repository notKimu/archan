import {
    PermissionFlagsBits,
    SlashCommandBuilder,
  } from "discord.js";
  import { SlashCommand } from "../../types";
  import { getGuildData, levelUpFormatter, saveGuildData } from "../../db/functions";
import { cooldowns } from "../../utils/defaults";
  
  const command: SlashCommand = {
    command: new SlashCommandBuilder()
      .setName("set-level-up-message")
      .setNameLocalizations({ "es-ES": "mensaje-subir-nivel" })
      .setDescription("The message I send when someone levels up!")
      .setDescriptionLocalizations({ "es-ES": "El mensaje que envío cuando alguien sube de nivel!" })
      .addStringOption((option) =>
        option
          .setName("message")
          .setNameLocalizations({ "es-ES": "mensaje" })
          .setDescription("{member} and {level} will be replaced by it's values")
          .setDescriptionLocalizations({ "es-ES": "{member} y {level} son reemplazados por sus valores!" })
          .setMinLength(10)
          .setMaxLength(120)
          .setRequired(true)
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    execute: async (interaction) => {
      const { guild, member, options } = interaction;
      const message: string = options.getString("message")!;
      if (!message) return interaction.reply({ content: "Wohoho, I didn't receive enough parameters to run this command!", ephemeral: true });
  
      const guildData = await getGuildData(guild.id);
  
      guildData.levelUpEmbedMessage = message;
  
      await saveGuildData(guild.id, { ...guildData });
  
      interaction.reply({
        content: `Okay! Now message of the embed I will send when someone levels up will be:\n> ${levelUpFormatter(message, 69, member.id)}`,
        ephemeral: true,
      });
    },
    cooldown: cooldowns.levels,
  };
  
  export default command;
  