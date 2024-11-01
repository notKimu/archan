import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../types";
import { getUserData, saveUserData } from "../../db/functions";
import { cooldowns } from "../../utils/defaults";
import { downloadImage } from "../../utils/downloads";

const supportedImageTypes = [
    "images/jpg",
    "images/jpeg",
    "images/png",
];

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("rank-image")
        .setNameLocalizations({ "es-ES": "imagen-rank" })
        .setDescription("Set a custom image for your /rank card!")
        .setDescriptionLocalizations({ "es-ES": "Pon una imagen a tu /rango!" })
        .addAttachmentOption((option) =>
            option
                .setName("image")
                .setNameLocalizations({ "es-ES": "imagen" })
                .setDescription("What image do you want to use?")
                .setDescriptionLocalizations({"es-ES": "A ver esa imagen c:"})
                .setRequired(true)
        ),
    execute: async (interaction) => {
        const { guild, options, user } = interaction;
        const image = options.getAttachment("image");
        if (!image)
            return interaction.reply({
                content:
                    "Wohoho, I didn't receive enough parameters to run this command!",
                ephemeral: true,
            });

        // Image verification, yes, it is heavy (from TF2)
        if (
            !image.contentType ||
            supportedImageTypes.includes(image.contentType)
        )
            return interaction.reply({
                content: "Hey! The image type must be `PNG`, `JPEG` or `WEBP`!",
                ephemeral: true,
            });
        else if (image.size > 8000000)
            return interaction.reply({
                content: "Hey! The image can't be larger than 8MB!",
                ephemeral: true,
            });
        else if (
            !image.height ||
            !image.width ||
            image.height < 100 ||
            image.width < 200 ||
            image.height > 1440 ||
            image.width > 3160
        )
            return interaction.reply({
                content:
                    "Hey! The image has to be between 100x100 and 3160x1440 pixels!",
                ephemeral: true,
            });

        await interaction.deferReply();

        // Saving the image into the filesystem
        try {
            const imagePath = await downloadImage({
                url: image.url,
                user_id: user.id,
                guild_id: guild.id,
                category: "ranks",
            });

            const userData = await getUserData(guild.id, user.id);
            userData.rankURL = imagePath;
            await saveUserData(guild.id, user.id, { ...userData });

            interaction.editReply(
                "I saved the image to the database! Go try it out and let it shine c:"
            );
        } catch (error) {
            console.error(error);
            return await interaction.editReply(
                "An error ocurred while saving your image, please try again later..."
            );
        }
    },
    cooldown: cooldowns.levelsHeavy,
};

export default command;
