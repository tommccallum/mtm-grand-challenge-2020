import { CobolFileControlFormat } from "./CobolFileControlFormat";
import { RowGroup } from "./RowGroup";
import { InferredDataFileFormat } from "./InferredDataFileFormat";
import { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } from "constants";

export class CobolFileSectionWriter {
    output: string;

    constructor() {
        this.output = "";
    }

    writeRowGroup(rowGroup: RowGroup, fileControlFormats: Array<CobolFileControlFormat>) {
        this.output = "";
        fileControlFormats.forEach((fileControlFormat) => {
            let rowGroupIndex = 1;
            this.output += "\n";
            this.output += fileControlFormat.toString();
            this.output += "\n01 RECORD-STYLE-" + rowGroupIndex+".";
            let cellCounter = 1;
            for (let cell of rowGroup.columns) {
                if (cell.isFiller()) {
                    this.output += "\n05 FILLER " + cell.getCobolType()+".";
                } else {
                    this.output += "\n05 RS" + rowGroupIndex + "-COL-" + cellCounter + "    " + cell.getCobolType()+".";
                }
                cellCounter++;
            }
        });
        this.output = this.indent(this.output);
    }

    indent(str: string ) {
        let lines = str.split("\n");
        let cIndent = 0;
        for( let ii=0; ii < lines.length; ii++ ) {
            if ( lines[ii].substr(0,2) === "FD" ) {
                cIndent = 0;
            }
            if ( lines[ii].substr(0,2) === "01" ) {
                cIndent = 0;
            }
            if ( cIndent === 0 ) {
                lines[ii] = "       "+lines[ii];
                cIndent++;
            } else if ( cIndent >= 1 ) {
                lines[ii] = "       "+"    "+lines[ii];
            }
        }
        return lines.join("\n");
    }
}

