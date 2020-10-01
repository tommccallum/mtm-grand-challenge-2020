import { CodeWriter } from "./CodeWriter";

export class CobolCodeWriter extends CodeWriter {
    constructor(filename: string) {
        super(filename);
        this.type = "CobolCodeWriter";
    }
}
