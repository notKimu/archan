import { AttachmentBuilder, Events, GuildMember } from "discord.js";
import { BotEvent } from "../types";
import { createCanvas, loadImage, registerFont } from "canvas";
import { getRandom } from "../utils/defaults";

const canvasHeight = 200;
const canvasWidth = 593;

const randomMessages = [
    "I hope you are doing great.",
    "how are youuuuuuu?",
    "remember to check the rules channel...",
    "I was waiting for you.",
    "have you tried Gentoo yet?",
    "if you are seeing this I didn't crash yet.",
    "[object Object] (just kidding)",
    "I hope you are not null.",
    "go to the index channel and talk a little bit!",
    "this is a random message, poggers.",
    "I wish this rando message list was infinite, but here we are.",
];

registerFont("./assets/fonts/HurmitNerdFont-Regular.otf", { family: "hurmit" });

const event: BotEvent = {
    name: Events.GuildMemberAdd,

    execute: async (member: GuildMember) => {
        /**RANK CANVAS */
        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext("2d");

        // Load background image
        // TODO: Allow to set a custom bg per guild
        const defaultBackground = "./assets/img/welcome.jpeg";
        await loadImage(defaultBackground).then((image) => {
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
        ctx.fillText(member.id, 198, 182);

        // Save image to buffer as file and send
        const image = new AttachmentBuilder(canvas.toBuffer("image/png"), {
            name: `${member.displayName}_Welcome.png`,
        });

        await member.guild.systemChannel?.send({
            content: `Hewo <@${member.id}>!\nWelcome to Kaskade, ${
                randomMessages[getRandom(randomMessages.length)]
            }`,
            files: [image],
        });
    },
};

export default event;
