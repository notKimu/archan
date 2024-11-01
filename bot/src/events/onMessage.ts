import { Channel, Events, Message, PermissionFlagsBits } from "discord.js";
import { BotEvent } from "../types";
import {
    getBadWords,
    getGuildData,
    getUserData,
    getWhitelistedRoles,
    getXpNeeded,
    levelUpEmbed,
    levelUpFormatter,
    levelUpWithRewardFormatter,
    randomXp,
    saveGuildData,
    saveUserData,
    updateLeaderboard,
} from "../db/functions";
import { sendToSecureChannel } from "../utils/channels";

const event: BotEvent = {
    name: Events.MessageCreate,

    execute: async (message: Message) => {
        const { channel, guild, member, author, content } = message;

        if (!guild || author.bot || !member) return;
        if (content === "") return;

        // Bad Words
        const badWords = await getBadWords(guild.id);
        const whiteListedRoles = await getWhitelistedRoles(guild.id);
        if (
            badWords &&
            !member.permissions.has(PermissionFlagsBits.ManageMessages) &&
            whiteListedRoles &&
            badWords.some((word) => content.toLowerCase().includes(word)) &&
            !member.roles.cache.find((role) => whiteListedRoles.includes(role.id))
        ) {
            return await message.delete();
        }

        // Levels
        let guildData = await getGuildData(guild.id);
        if (guildData.noXpChannels.includes(channel.id)) return;
        let userData = await getUserData(guild.id, author.id);

        userData.xp += randomXp(guildData.maxXpMessage);

        if (userData.xp >= getXpNeeded(userData.level, guildData.baseXP, guildData.difficulty)) {
            userData.xp = 0;
            userData.level += 1;

            const securedChannel: Channel = await sendToSecureChannel(guild, guildData.levelChannel!, "level-up");
            guildData.levelChannel = securedChannel.id;
            await saveGuildData(guild.id, { ...guildData });

            const reward = guildData.rewards.find((rewardData) => rewardData.level === userData.level);
            if (reward) {
                try {
                    await member.roles.add(reward.role);

                    const gotRewardEmbed = levelUpEmbed(
                        guildData.rewardEmbedTitle,
                        levelUpWithRewardFormatter(guildData.rewardEmbedMessage, userData.level, member.id, reward.role),
                        member.displayHexColor,
                        guild
                    );

                    await securedChannel.send({
                        content: `${member}`,
                        embeds: [gotRewardEmbed],
                    });
                } catch { }
            } else {
                const sendLevelUpEmbed = levelUpEmbed(
                    guildData.levelUpEmbedTitle,
                    levelUpFormatter(guildData.levelUpEmbedMessage, userData.level, member.id),
                    member.displayHexColor,
                    guild
                );

                await securedChannel.send({
                    content: `${member}`,
                    embeds: [sendLevelUpEmbed],
                });
            }
        }

        await updateLeaderboard(
            guild.id,
            member.id,
            getXpNeeded(userData.level - 1, guildData.baseXP, guildData.difficulty) + userData.xp
        );

        await saveUserData(guild.id, author.id, { ...userData });
    },
};

export default event;
