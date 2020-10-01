import { readFileSync } from "fs";

export function basename(str: string) : string {
    var base = new String(str).substring(str.lastIndexOf('/') + 1);
    return base;
}

export function dirname(str: string) : string {
    var base = new String(str).substring(0, str.lastIndexOf('/'));
    return base;
}

export function checkForTags(filePath:string) {
    let content = readFileSync(filePath, "utf-8");
    let tagRegExp = new RegExp(/{{[A-Za-z0-9-]+}}/);
    return tagRegExp.test(content);
}