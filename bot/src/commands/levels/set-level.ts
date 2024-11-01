import {
  GuildMember,
  PermissionFlagsBits,
  SlashCommandBuilder,
  User,
} from "discord.js";
import { SlashCommand } from "../../types";
import {
  getGuildData,
  getUserData,
  saveUserData,
} from "../../db/functions";
import { cooldowns } from "../../utils/defaults";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("set-level")
    .setNameLocalizations({ "es-ES": "ajustar-nivel" })
    .setDescription("Set the level a member has!")
    .setDescriptionLocalizations({ "es-ES": "Ajusta el nivel de un miembro!" })
    .addIntegerOption((option) =>
      option
        .setName("level")
        .setNameLocalizations({ "es-ES": "nivel" })
        .setDescription("The level you want to give")
        .setDescriptionLocalizations({ "es-ES": "El nivel que quieres ponerle" })
        .setMaxValue(1000)
        .setMinValue(0)
        .setRequired(true)
    )
    .addMentionableOption((option) =>
      option
        .setName("member")
        .setNameLocalizations({ "es-ES": "miembro" })
        .setDescription("Whose level do you want to change?")
        .setDescriptionLocalizations({ "es-ES": "A quien le pondrás este nivel?" })
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("affects-roles")
        .setNameLocalizations({ "es-ES": "afecta-roles" })
        .setDescription("Should I add or remove user roles?")
        .setDescriptionLocalizations({ "es-ES": "Doy / quito los niveles dependiendo del nivel?" })
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  execute: async (interaction) => {
    const { guild, options } = interaction;
    const targetLevel: number = options.getInteger("level")!;
    const affectsRoles: boolean = options.getBoolean("affects-roles")!;
    const targetUser: User = options.getUser("member")!;
    const targetMember: GuildMember = guild.members.cache.get(targetUser.id)!;
    if (targetLevel === null || affectsRoles === null || !targetMember) return interaction.reply({ content: "Wohoho, I didn't receive enough parameters to run this command!", ephemeral: true });

    if (!targetMember)
      return interaction.reply({
        content: "That doesn't look like a valid member to me...",
        ephemeral: true,
      });

    const userData = await getUserData(guild.id, targetMember.id);
    const guildData = await getGuildData(guild.id);

    if (affectsRoles) {
      const [min, max] = [targetLevel, userData.level].sort((a, b) => a - b);

      const roles: Array<string> = guildData.rewards.reduce((acc: string[], reward) => {
        if (reward.level >= min && reward.level <= max) {
          acc.push(reward.role);
        }
        return acc;
      }, []);

      targetLevel > userData.level
        ? targetMember.roles.add(roles)
        : targetMember.roles.remove(roles);
    }

    [userData.level, userData.xp] = [targetLevel, 0];

    await saveUserData(guild.id, targetMember.id, { ...userData });

    interaction.reply({
      content: `Nice! Now ${targetMember}'s level is ${targetLevel} -w-`,
      ephemeral: true,
    });
  },
  cooldown: cooldowns.levels,
};

export default command;
