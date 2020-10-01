import { CodeWriter } from "./CodeWriter";

export class JclCodeWriter extends CodeWriter {
    constructor(filename: string) {
        super(filename);
        this.type = "JclCodeWriter";
    }
}
