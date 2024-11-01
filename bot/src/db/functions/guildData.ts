import redis from "../redis";
import { logError } from "../../utils/console";

interface guildStructure {
  baseXP: number;
  difficulty: number;
  levelChannel: string | null;
  levelUpEmbedTitle: string;
  levelUpEmbedMessage: string;
  rewardEmbedTitle: string;
  rewardEmbedMessage: string;
  maxXpMessage: number;
  rewards: levelsStructure[];
  noXpChannels: string[];
}

interface levelsStructure {
  level: number;
  role: string;
}

const defaultGuild: guildStructure = {
  baseXP: 500,
  difficulty: 1.1,
  levelChannel: null,
  rewardEmbedTitle: "Sudo apt upgrade",
  rewardEmbedMessage:
    "{member} got updated to level **{level}**!\nKeep it up!",
  levelUpEmbedTitle: "Sudo apt update",
  levelUpEmbedMessage:
    "{member} got updated to level **{level}** and got the role {role}!\nGo Go Go!",
  maxXpMessage: 40,
  rewards: [],
  noXpChannels: [],
};

// Save user data
export async function saveGuildData(
  guildId: string,
  values: guildStructure
): Promise<void> {
  const serializedValues = JSON.stringify(values);
  await redis.hSet(`guilds:${guildId}`, "values", serializedValues);
}

// Fetch user data
export async function getGuildData(guildId: string): Promise<guildStructure> {
  const serializedValues = await redis.hGet(`guilds:${guildId}`, "values");

  // Create level data if doesnt exist
  if (!serializedValues) {
    saveGuildData(guildId, defaultGuild);
    return defaultGuild;
  }

  const values = JSON.parse(serializedValues);

  return values;
}

// Update the leaderboard of the guild
export async function updateLeaderboard(
  guildId: string,
  userId: string,
  totalXp: number
) {
  await redis
    .zAdd(`ranking:${guildId}`, { value: userId, score: totalXp })
    .catch((err) => {
      logError(
        `I couldn't save the user ${userId} into the rank of ${guildId}:\n${err}`
      );
    });
}

// Get the leaderboard of the guild
export async function getLeaderboard(guildId: string, limit: number) {
  return (
    await redis.zRangeWithScores(`ranking:${guildId}`, 0, limit)
  ).reverse();
}

// Get the user's position leaderboard of the guild
export async function getUserRanking(guildId: string, userId: string) {
  const userPosition = await redis.zRevRank(`ranking:${guildId}`, userId);
  return userPosition !== null ? userPosition + 1 : "Talk to have a rank!";
}