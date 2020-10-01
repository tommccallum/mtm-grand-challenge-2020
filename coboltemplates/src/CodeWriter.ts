import { readFileSync, writeFileSync } from 'fs';


// This class transforms the code with a set of replacement strings
// and then writes it to a given location.  It should not have
// any language specific aspects to it.
export class CodeWriter {
    filename: string;
    originalCode: string;
    modifiedCode: string;
    type: string;

    constructor(filename: string) {
        this.type = "BaseCodeWriter";
        this.filename = filename;
        this.originalCode = "";
        this.modifiedCode = "";
    }

    findTags(): Set<string> {
        let content: string = readFileSync(this.filename, 'utf-8');
        let tags = new RegExp("{{[A-Za-z0-9-]+}}", "mg");
        let matches: RegExpExecArray | null;
        let foundTags = new Set<string>();
        while ((matches = tags.exec(content)) !== null) {
            matches.forEach((value: string, index: number) => {
                let variableName: string = value.substr(2, value.lastIndexOf('}}') - 2).trim().toUpperCase();
                foundTags.add(variableName);
            });
        }
        return foundTags;
    }

    replaceTags(tagReplacements: Map<string, string>) {
        let content: string = readFileSync(this.filename, 'utf-8');
        this.originalCode = content;
        let tags = new RegExp("{{[A-Za-z0-9-]+}}", "mg");
        let matches: RegExpExecArray | null;
        while ((matches = tags.exec(content)) !== null) {
            matches.forEach((value: string, index: number) => {
                let variableName: string = value.substr(2, value.lastIndexOf('}}') - 2).trim().toUpperCase();
                if (tagReplacements.has(variableName)) {
                    let replacement: string = tagReplacements.get(variableName)!;
                    content = content.replace("{{"+variableName+"}}", replacement);
                }
            });
        }
        this.modifiedCode = content;
    }

    writeToFile(destFilePath: string) {
        writeFileSync(destFilePath, this.modifiedCode);
    }
}

