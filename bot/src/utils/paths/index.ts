import { join } from "path";

export default {
    EXTERNAL_CONTENT: join(global.__basedir, "../../external"),
    ASSETS: join(global.__basedir, "../assets"),
    ASSETS_IMAGES: join(global.__basedir, "../assets/img"),
    ASSETS_FONTS: join(global.__basedir, "../assets/fonts"),
    ASSETS_JSON: join(global.__basedir, "../assets/json"),
    COMMANDS: join(global.__basedir, "commands"),
} as const