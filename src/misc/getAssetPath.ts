import fs from 'fs';
import path from 'path';

interface ManifestEntry {
    file: string;
    css?: string[];
}

interface Manifest {
    [key: string]: ManifestEntry;
}

interface AssetPaths {
    jsPath: string;
    cssPaths: string[];
}

export function getAssetPaths(assetName: string): AssetPaths {
    const manifestPath: string = path.resolve(__dirname, '..', 'public', '.vite', 'manifest.json');
    const manifest: Manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

    const assetPaths: AssetPaths = { jsPath: '', cssPaths: [] };

    const entry = manifest[assetName];
    if (entry) {
        if (entry.file) {
            assetPaths.jsPath = entry.file;
        }
        // Directly assign entry.css to assetPaths.cssPaths
        // If entry.css is undefined, cssPaths will be an empty array
        assetPaths.cssPaths = entry.css || [];
    }

    return assetPaths;
}
