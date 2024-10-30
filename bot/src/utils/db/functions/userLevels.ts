import redis from "../redis";

// Save user data
export async function saveUserData(
  guildId: string,
  userId: string,
  values: { xp: number; level: number; rankURL?: string }
): Promise<void> {
  const serializedValues = JSON.stringify(values);

  await redis.hSet(`levels:${guildId}:${userId}`, "values", serializedValues);
}

// Fetch user data
export async function getUserData(
  guildId: string,
  userId: string
): Promise<{ xp: number; level: number; rankURL?: string }> {
  const serializedValues = await redis.hGet(
    `levels:${guildId}:${userId}`,
    "values"
  );

  // Create level data if doesnt exist
  if (!serializedValues) {
    const defaultValues = { xp: 0, level: 0 };
    saveUserData(guildId, userId, defaultValues);
    return defaultValues;
  }

  const values = JSON.parse(serializedValues);

  return values;
}

// Format the level up messages
export function levelUpFormatter(
  message: string,
  level: number,
  memberID: string
): string {
  return message
    .replace("{member}", `<@${memberID}>`)
    .replace("{level}", level.toString());
}

// Format the level up when a user gets a role messages
export function levelUpWithRewardFormatter(
  message: string,
  level: number,
  memberID: string,
  roleID: string
): string {
  return message
    .replace("{member}", `<@${memberID}>`)
    .replace("{level}", level.toString())
    .replace("{role}", `<@&${roleID}>`);
}
