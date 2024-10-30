import {
    AttachmentBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from "discord.js";
import { SlashCommand } from "../../types";
import { createCanvas, loadImage, registerFont } from "canvas";
import { cooldowns } from "../../utils/defaults";

const canvasHeight = 200;
const canvasWidth = 593;

registerFont("./assets/fonts/HurmitNerdFont-Regular.otf", { family: "hurmit" });

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("test-welcome")
        .setDescription("Test the welcome message")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    execute: async (interaction) => {
        const { guild, options, member } = interaction;

        /**RANK CANVAS */
        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext("2d");

        // Load background image
        // TODO: Allow to set a custom bg per guild
        const defaultBackground = "./assets/img/welcome.jpeg";
        await loadImage(
            defaultBackground
        ).then((image) => {
            ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
        });

        // Load avatar
        await loadImage(
            member.displayAvatarURL({
                extension: "png",
                forceStatic: true,
                size: 256,
            })
        ).then((image) => {
            ctx.drawImage(image, 18, 19, 163, 163);
        });

        
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "40px hurmit";
        
        // Render welcome message
        ctx.fillText("@Kaskade.sv", 198, 49);

        ctx.font = "30px hurmit";
        // Render name
        ctx.fillText(member.displayName, 198, 154);
        
        ctx.font = "14px hurmit";
        // Render user ID
        ctx.fillText(member.user.id, 198, 182);


        // Save image to buffer as file and send
        const image = new AttachmentBuilder(canvas.toBuffer("image/png"), {
            name: `${member.displayName}_Welcome.png`,
        });

        await interaction.reply({ files: [image] });
    },

    cooldown: cooldowns.levelsHeavy,
};

export default command;
