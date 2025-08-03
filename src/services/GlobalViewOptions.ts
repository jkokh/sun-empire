import { Injectable } from '@tsed/di';
import { getAssetPaths } from '../misc/getAssetPath';

@Injectable()
export class GlobalViewOptions {
    $alterRenderOptions(options: Record<string, any>) {
        if (process.env.NODE_ENV !== 'local') {
            const { jsPath, cssPaths } = getAssetPaths('src/app.tsx');
            options.appPath = jsPath;
            options.cssPaths = cssPaths;
        }
        return options;
    }
}
