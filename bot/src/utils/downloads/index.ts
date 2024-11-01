import https from "https";
import { join, resolve } from "path";
import { createWriteStream, existsSync, unlink } from "fs";
import { rm, mkdir } from "fs/promises";
import paths from "../../utils/paths";

type ImageCategory = "ranks" | "profiles";

/**
 * Downloads the image from a URL and saves it to the
 * download directory
 */
export async function downloadImage(data: {
    url: string;
    user_id: string;
    guild_id: string;
    category: ImageCategory;
}) {
    const destinationFolder = join(paths.EXTERNAL_CONTENT, data.category);
    await mkdir(destinationFolder, { recursive: true });
    
    const fileName = `${data.category}_${data.guild_id}_${data.user_id}`;
    const destinationFile = resolve(destinationFolder, fileName);
    if (existsSync(destinationFile)) await rm(destinationFile);

    const file = createWriteStream(destinationFile);

    https.get(data.url, response => {
        response.pipe(file);
      
        file.on('finish', () => {
          file.close();
        });
      }).on('error', err => {
        unlink(destinationFile, () => {
            throw new Error("Error downloading the image")
        });
        throw new Error("Error downloading the image");
      });

    return destinationFile;
}
