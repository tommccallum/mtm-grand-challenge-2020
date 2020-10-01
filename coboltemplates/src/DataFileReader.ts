import { DataFileFormatConfig } from './DataFileFormatConfig';
import { readFileSync } from 'fs';
import { InferredDataFileFormat } from './InferredDataFileFormat';
import { Row } from "./Row";
import { RowGroup } from "./RowGroup";
import { nextTick } from 'process';

// This is the final output, the generalised
// file format for this file.


export class DataFileReader {
    lineStructures: Array<Row>;
    filename: string;
    config: DataFileFormatConfig;
    dataLineCount: number;

    constructor(filename: string, config: DataFileFormatConfig) {
        this.lineStructures = new Array<Row>();
        this.filename = filename;
        this.config = config;
        this.dataLineCount = 0;
    }

    read(): void {
        let contents: string = readFileSync(this.filename, 'utf-8');
        let lines = contents.split(this.config.lineDelimiter);
        let lineCounter = 0;
        for (let line of lines) {
            if ( line.trim().length === 0 ) {
                continue;
            } 
            let ln = new Row(line, this.config);
            this.lineStructures.push(ln);
            if (this.config.maxLinesToRead > 0 && lineCounter >= this.config.maxLinesToRead) {
                break;
            }
            lineCounter++;
        }
        if ( lineCounter === 0 ) {
            throw Error("No data found in selected '"+this.filename+"'.");
        }
    }

    parse(): InferredDataFileFormat {
        // first we parse each line into structures
        for (let ln of this.lineStructures) {
            ln.parse();
        }

        let fileFormat = new InferredDataFileFormat();
        let rowGroup = new RowGroup();
        for (let ii = 0; ii < this.lineStructures.length; ii++) {
            if (rowGroup.isEmpty()) {
                rowGroup.add(this.lineStructures[ii]);
            } else {
                if (!rowGroup.hasSameStructure(this.lineStructures[ii])) {
                    fileFormat.add(rowGroup);
                    rowGroup = new RowGroup();
                    rowGroup.add(this.lineStructures[ii]);
                }
            }
        }
        fileFormat.add(rowGroup);

        fileFormat.optimise();

        return fileFormat;
    }
}

