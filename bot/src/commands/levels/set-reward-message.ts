import {
    PermissionFlagsBits,
    SlashCommandBuilder,
  } from "discord.js";
  import { SlashCommand } from "../../types";
  import { getGuildData, levelUpWithRewardFormatter, saveGuildData } from "../../db/functions";
import { cooldowns } from "../../utils/defaults";
  
  const command: SlashCommand = {
    command: new SlashCommandBuilder()
      .setName("set-reward-message")
      .setNameLocalizations({ "es-ES": "mensaje-recompensa" })
      .setDescription("Set the message I send when a user gets a role!")
      .setDescriptionLocalizations({ "es-ES": "Pon el mensaje que envío cuando alguien consigue un rol" })
      .addStringOption((option) =>
        option
          .setName("message")
          .setNameLocalizations({ "es-ES": "mensaje" })
          .setDescription("{member} {level} and {role} will be replaced by it's values")
          .setDescriptionLocalizations({ "es-ES": "{member} {level} {role} se cambian por sus valores" })
          .setMinLength(10)
          .setMaxLength(150)
          .setRequired(true)
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    execute: async (interaction) => {
      const { guild, member, options } = interaction;
      const message: string = options.getString("message")!;
      if (!message) return interaction.reply({ content: "Wohoho, I didn't receive enough parameters to run this command!", ephemeral: true });
  
      const guildData = await getGuildData(guild.id);
  
      guildData.rewardEmbedMessage = message;
      await saveGuildData(guild.id, { ...guildData });
  
      interaction.reply({
        content: `Hooray! Now message of the embed I will send when someone gets a reward will be:\n> ${levelUpWithRewardFormatter(message, 69, member.id, member.roles.highest.id)}`,
        ephemeral: true,
      });
    },
    cooldown: cooldowns.levels,
  };
  
  export default command;
  