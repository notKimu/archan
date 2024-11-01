import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../types";
import { getGuildData, saveGuildData } from "../../db/functions";
import { cooldowns } from "../../utils/defaults";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("remove-reward")
    .setNameLocalizations({ "es-ES": "quitar-recompensa" })
    .setDescription("Stop giving a role when a user gets to a level")
    .setDescriptionLocalizations({ "es-ES": "Dejar de dar un rol en este nivel" })
    .addIntegerOption((option) =>
      option
        .setName("level")
        .setNameLocalizations({ "es-ES": "nivel" })
        .setDescription("At what level do you want me to give the role?")
        .setDescriptionLocalizations({ "es-ES": "En que nivel dejo de dar el rol?" })
        .setMaxValue(1000)
        .setMinValue(1)
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  execute: async (interaction) => {
    const { guild, options } = interaction;
    const level: number = options.getInteger("level")!;
    if (level === null) return interaction.reply({ content: "Wohoho, I didn't receive enough parameters to run this command!", ephemeral: true });

    const guildData = await getGuildData(guild.id);

    const role = guildData.rewards.find((reward) => reward.level === level);
    if (!role)
      return interaction.reply({
        content: `Hey! Doesn't look like there is a reward configured for level **${level}**.`,
        ephemeral: true,
      });

    const rewardIndex = guildData.rewards.findIndex(reward => reward.level === level);
    if (rewardIndex !== -1) {
      guildData.rewards.splice(rewardIndex, 1);
    }

    await saveGuildData(guild.id, { ...guildData });

    interaction.reply({
      content: `Okay! I will stop giving the role <@&${role.role}> when someone reaches level **${level}**.`,
      ephemeral: true,
    });
  },
  cooldown: cooldowns.levelsFast,
};

export default command;
