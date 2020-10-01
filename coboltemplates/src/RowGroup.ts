
import { Cell } from "./Cell";
import { Row } from "./Row";

export class RowGroup {
    columns: Array<Cell>;
    coveredRowsCount: number;

    constructor() {
        this.columns = new Array<Cell>();
        this.coveredRowsCount = 0;
    }

    add(lineStructure: Row): void {
        for (let cell of lineStructure.cells) {
            this.columns.push(cell.clone());
        }
        this.coveredRowsCount++;
    }

    getRecordWidth(): number {
        let recordWidth = 0;
        for (let col of this.columns) {
            recordWidth += col.size;
        }
        return recordWidth;
    }

    hasSameStructure(lineStructure: Row): boolean {
        if (this.isEmpty()) {
            return false;
        }
        if (this.columns.length > lineStructure.cells.length) {
            return false;
        }

        let bIndex = 0;
        for (let index in this.columns) {
            if (bIndex >= lineStructure.cells.length) {
                return false;
            }
            let cellA = this.columns[index];

            // Here we are greedily eating those cells which might 
            // have been mistakenly broken apart.
            // It handles the case where we have something like the 
            // following:
            // abcdefghi   10      
            // abcd efghik  9     <-- here the first cell is split in 2 when it should be one
            let cellB = lineStructure.cells[bIndex];
            bIndex++;
            if (cellB.isTypeOfString() && lineStructure.cells.length > this.columns.length) {
                let cellBLength = cellB.size;
                while (cellBLength < cellA.size && bIndex < lineStructure.cells.length) {
                    cellBLength += lineStructure.cells[bIndex].size;
                    cellB.value += lineStructure.cells[bIndex].value;
                    cellB.size += lineStructure.cells[bIndex].size;
                    lineStructure.cells.splice(bIndex, 1);
                }

            }

            if (!cellA.covers(cellB)) {
                if (cellB.covers(cellA)) {
                    // replace it with the new cell
                    this.columns[index] = cellB.clone();
                } else {
                    return false;
                }
            }
        }
        if (this.columns.length !== lineStructure.cells.length) {
            return false;
        }
        this.coveredRowsCount++;
        return true;
    }

    isEmpty(): boolean {
        return this.columns.length === 0;
    }

    // Collapse columns down to 1
    collapse(): void {
        let newCell = this.columns[0];
        for (let index = 1; index < this.columns.length; index++) {
            newCell.value += this.columns[index].value;
            newCell.size += this.columns[index].size;
        }
        this.columns.splice(1);
    }
}
