import { CobolFileControlFormat} from "./CobolFileControlFormat";
import {RowGroup} from "./RowGroup";
import { CobolFileSectionWriter } from "./CobolFileSectionWriter";

// Each RowGroup is a separate format that has a separate Definition in Cobol
export class InferredDataFileFormat {
    rowGroups: Array<RowGroup>;
    recordWidth: number;
    recordingMode: string;
    
    constructor() {
        this.rowGroups = new Array<RowGroup>();
        this.recordWidth = 80;
        this.recordingMode = "F";
    }

    add(rowGroup: RowGroup) {
        this.rowGroups.push(rowGroup);
        if (rowGroup.getRecordWidth() > this.recordWidth) {
            this.recordWidth = rowGroup.getRecordWidth();
        }
    }

    transform(writer: CobolFileSectionWriter, fileControlFormats: Array<CobolFileControlFormat>) {
        for (let rowGroup of this.rowGroups) {
            writer.writeRowGroup(rowGroup, fileControlFormats);
        }
        return writer.output;
    }

    optimise() {
        this.optimiseForSingleColumn();
    }

    optimiseForSingleColumn(): void {
        for (let ii = 1; ii < this.rowGroups.length; ii++) {
            if (ii > 0 && ii < this.rowGroups.length - 1) {
                if (this.rowGroups[ii - 1].columns.length === 1 &&
                    this.rowGroups[ii - 1].columns.length === this.rowGroups[ii + 1].columns.length) {
                    if (this.rowGroups[ii].columns.length !== this.rowGroups[ii + 1].columns.length) {
                        this.rowGroups[ii].collapse();
                        this.rowGroups[ii - 1].columns[0].size = Math.max(this.rowGroups[ii - 1].columns[0].size, this.rowGroups[ii].columns[0].size);
                        this.rowGroups[ii - 1].columns[0].size = Math.max(this.rowGroups[ii - 1].columns[0].size, this.rowGroups[ii + 1].columns[0].size);
                        this.rowGroups.splice(ii, 2);
                    }
                }
            }
        }
    }
}