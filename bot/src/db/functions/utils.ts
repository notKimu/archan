import { ColorResolvable, EmbedBuilder, Guild } from "discord.js";
import { guildFooter } from "../../utils/defaults/guild";

// Get XP needed for a level
export function getXpNeeded(level: number, baseXP: number, difficulty: number) {
    return level * baseXP * difficulty;
}

export function randomXp(maxXp: number): number {
    return Math.floor(Math.random() * maxXp + 1);
}

export function levelUpEmbed(
    title: string,
    description: string,
    color: ColorResolvable,
    guild: Guild
) {
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setFooter(guildFooter(guild, "Levels"));
}
