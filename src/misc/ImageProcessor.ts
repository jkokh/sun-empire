import { join } from 'path';
import * as fs from 'fs';
import * as util from 'util';

const mkdir = util.promisify(fs.mkdir);
const access = util.promisify(fs.access);
const unlink = util.promisify(fs.unlink);

const dimensions = new Set(['100x100', '200x200', '400x400', '800x800']);

export class ImageProcessor {
    private readonly baseFolder: string;
    private readonly srcFolder: string;

    constructor(baseFolder: string) {
        this.baseFolder = baseFolder;
        this.srcFolder = join(this.baseFolder, 'src');
    }

    async resizeAndSave(imageFile: string) {
        const srcFilePath = join(this.srcFolder, imageFile);

        try {
            await access(srcFilePath, fs.constants.F_OK);
        } catch (error) {
            console.error(`Source file ${srcFilePath} not found.`);
            return;
        }

        for (const dimension of dimensions) {
            const [width, height] = dimension.split('x').map(Number);
            const outputFolder = join(this.baseFolder, dimension);
            await this.ensureFolderExists(outputFolder);
            const outputFilePath = join(outputFolder, imageFile.replace(/\.[^/.]+$/, '.jpg'));

        }
    }

    async deleteImage(imageFile: string) {
        const srcFilePath = join(this.srcFolder, imageFile);

        try {
            await access(srcFilePath, fs.constants.F_OK);
            await unlink(srcFilePath);
            console.log(`Deleted source image: ${srcFilePath}`);
        } catch (error) {
            console.error(`Source file ${srcFilePath} not found. Cannot delete.`);
        }

        for (const dimension of dimensions) {
            const outputFolder = join(this.baseFolder, dimension);
            const outputFilePath = join(outputFolder, imageFile.replace(/\.[^/.]+$/, '.jpg'));
            try {
                await access(outputFilePath, fs.constants.F_OK);
                await unlink(outputFilePath);
                console.log(`Deleted resized image: ${outputFilePath}`);
            } catch (error) {
                console.warn(`Resized file ${outputFilePath} not found. Skipping.`);
            }
        }
    }

    private async ensureFolderExists(folderPath: string) {
        try {
            await access(folderPath, fs.constants.F_OK);
        } catch {
            await mkdir(folderPath, { recursive: true });
            console.log(`Folder created: ${folderPath}`);
        }
    }
}
