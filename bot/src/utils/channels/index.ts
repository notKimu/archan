import { Channel, ChannelType, Guild, TextChannel } from "discord.js";

export async function sendToSecureChannel(guild: Guild, channelId: string, alternativeName: string) {
    const securedChannel: Channel =
        guild.client.channels.cache.get(channelId) ??
        await guild.channels
            .create({
                name: alternativeName,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone.id,
                        deny: ["SendMessages"],
                    },
                ],
            });

    return securedChannel as TextChannel;
}
