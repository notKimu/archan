import { Guild } from "discord.js";

export function getGuildIcon(guild: Guild, size: 256 | 512 | 1024 | 2048) {
  return (
    guild.iconURL({
      size: size,
    }) ??
    "https://cdn.discordapp.com/attachments/1031831479447212073/1129387807429898290/discordGuild.png"
  );
}

export function guildFooter(guild: Guild, commandCategory: string) {
    return { text: `${guild.name} - ${commandCategory}`, iconURL: getGuildIcon(guild, 256)}
}