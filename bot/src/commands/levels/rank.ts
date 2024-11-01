import {
    AttachmentBuilder,
    GuildMember,
    SlashCommandBuilder,
    User,
} from "discord.js";
import { SlashCommand } from "../../types";
import { stat } from "fs/promises";
import { createCanvas, loadImage } from "canvas";
import { join } from "path";
import {
    getGuildData,
    getUserData,
    getXpNeeded,
} from "../../db/functions";
import { trimmer } from "../../utils/defaults/strings";
import { cooldowns } from "../../utils/defaults";
import paths from "../../utils/paths";

const canvasHeight = 200;
const canvasWidth = 700;

const levelBarWidth = 483;
const levelBarHeight = 43;

// Depending on the system the registerFont function won't do anything
// so I ended up installing the font on the system and using it that way
//
// registerFont(join(paths.ASSETS_FONTS, "Koulen.ttf"), { family: "Koulen", style: "Regular" });

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("rank")
        .setNameLocalizations({ "es-ES": "rango" })
        .setDescription("See how much XP you have and the level you are at!")
        .setDescriptionLocalizations({
            "es-ES": "Mira tu XP y tu nivel en una imagen!",
        })
        .addMentionableOption((option) =>
            option
                .setName("member")
                .setNameLocalizations({ "es-ES": "miembro" })
                .setDescription("Do you want to see someone else's /rank?")
                .setDescriptionLocalizations({
                    "es-ES": "Quieres ver el rango de otra persona?",
                })
                .setRequired(false)
        ),
    execute: async (interaction) => {
        const { guild, options, user } = interaction;
        const rankUser: User = options.getUser("member") || user;
        const rankMember: GuildMember = guild.members.cache.get(rankUser.id)!;

        if (!rankMember)
            return interaction.reply({
                content: "That doesn't look like a valid member to me...",
                ephemeral: true,
            });

        await interaction.deferReply();

        const userData = await getUserData(guild.id, rankMember.id);
        const { baseXP, difficulty } = await getGuildData(guild.id);

        const level = userData.level;
        const xp = userData.xp;

        /**RANK CANVAS */
        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext("2d");

        ctx.lineWidth = 3;

        // Load background image
        const defaultImage = join(paths.ASSETS_IMAGES, "rankDefault.jpg");
        await loadImage(
            
            userData.rankURL && await stat(userData.rankURL).catch((e) => false) ? userData.rankURL : defaultImage
        ).then((image) => {
            ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
        });

        ctx.globalAlpha = 0.3;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = "#000000";
        ctx.globalAlpha = 1;

        // Load avatar
        await loadImage(
            rankMember.displayAvatarURL({
                extension: "png",
                forceStatic: true,
                size: 256,
            })
        ).then((image) => {
            ctx.drawImage(image, 18, 19, 163, 163);
        });

        // Frame in the color of the top role around the avatar
        ctx.strokeStyle = rankMember.displayHexColor;
        ctx.strokeRect(18, 19, 163, 163);

        
        // Render name
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "42px Koulen";
        ctx.fillText(rankMember.displayName, 199, 182);
        
        // Level numbers
        ctx.fillText(level.toString(), 199, 105);

        ctx.textAlign = "right";

        ctx.fillText((level + 1).toString(), 682, 105);

        ctx.font = "24px Koulen";

        // XP
        ctx.fillText(trimmer(xp.toString()), 676, 50);

        // Render level bar
        const progressBarWidth =
            levelBarWidth * (xp / getXpNeeded(level, baseXP, difficulty));

        // Progress bar
        ctx.fillStyle =
            rankMember.displayHexColor === "#000000"
                ? "#FFFFFF"
                : rankMember.displayHexColor;
        ctx.fillRect(199, 20, progressBarWidth, levelBarHeight);

        // Container bar
        ctx.strokeStyle = "white";

        ctx.strokeRect(199, 20, levelBarWidth, levelBarHeight);

        // Save image to buffer as file and send
        const image = new AttachmentBuilder(canvas.toBuffer("image/png"), {
            name: `${rankMember.displayName}_Rank.png`,
        });

        await interaction.editReply({ files: [image] });
    },

    cooldown: cooldowns.levelsHeavy,
};

export default command;
