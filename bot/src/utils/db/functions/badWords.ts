import redis from "../redis";

const MAX_WORDS = 50;
const MAX_ROLES = 10;

// Guild bad words
export async function addBadWord(
    guildId: string,
    word: string,
) {
    const currentBadWords = await getBadWords(guildId);
    if (currentBadWords && currentBadWords.length >= MAX_WORDS) return null;

    return await redis.rPush(`badwords:${guildId}`, word);
}

export async function getBadWords(
    guildId: string,
): Promise<string[] | undefined> {
    return await redis.lRange(`badwords:${guildId}`, 0, -1);
};

export async function removeBadWord(
    guildId: string,
    word: string,
) {
    return await redis.lRem(`badwords:${guildId}`, 1, word);
}

// Whitelisted roles bad words
export async function addWhitelistedRole(
    guildId: string,
    role: string,
) {
    const currentBadWords = await getBadWords(guildId);
    if (currentBadWords && currentBadWords.length >= MAX_ROLES) return null;

    return await redis.rPush(`badwords-roles:${guildId}`, role);
}

export async function getWhitelistedRoles(
    guildId: string,
): Promise<string[] | undefined> {
    return await redis.lRange(`badwords-roles:${guildId}`, 0, -1);
};

export async function removeWhitelistedRole(
    guildId: string,
    role: string,
) {
    return await redis.lRem(`badwords-roles:${guildId}`, 1, role);
}