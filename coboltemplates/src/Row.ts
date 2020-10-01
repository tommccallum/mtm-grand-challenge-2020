import { Cell } from "./Cell";
import { DataFileFormatConfig } from "./DataFileFormatConfig";

export class Row {
    config: DataFileFormatConfig;
    contents: string;
    cells: Array<Cell>;
    constructor(contents: string, config: DataFileFormatConfig) {
        this.config = config;
        this.cells = new Array<Cell>();
        this.contents = contents.trimRight();
    }

    parse(): void {
        let rawFields = this.contents.split(this.config.fieldDelimiter);
        for (let ii = 0; ii < rawFields.length; ii++) {
            let cell = new Cell(rawFields[ii]);
            this.cells.push(cell);

            if (ii < rawFields.length - 1) {
                let fillerCell = new Cell(this.config.fieldDelimiter);
                fillerCell.setFiller();
                this.cells.push(fillerCell);
            }
        }
    }

    length(): number {
        return this.contents.length;
    }

}
