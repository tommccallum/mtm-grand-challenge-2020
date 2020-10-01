import { ExtensionContext, Uri } from 'vscode';
import * as path from 'path';

module.exports = {
    /**
     * Returns the absolute path to a file located in our resources folder.
     *
     * @param file The base file name.
     * @param context The context of this extension to get its path regardless where it is installed.
     */
    getResourcesPath(file: string, context: ExtensionContext, asUri = false): string {
        if (asUri) {
            return Uri.file(context.asAbsolutePath(path.join('resources', file))).toString();
        }
        return Uri.file(context.asAbsolutePath(path.join('resources', file))).fsPath;
    }
};
