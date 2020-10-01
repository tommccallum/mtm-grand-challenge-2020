export class DataFileFormatConfig {
    fieldDelimiter: string;
    lineDelimiter: string;
    maxLinesToRead: number;

    constructor() {
        this.fieldDelimiter = " ";
        this.lineDelimiter = "\n";
        this.maxLinesToRead = 0;
    }
}