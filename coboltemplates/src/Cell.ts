import * as CobolTypeInference from "./CobolTypeInference";

// A cell is the structure of each field within a line.
export class Cell {
    size: number;
    type: string;
    value: string;
    signed: boolean;
    assumedDecimalPoint: boolean;
    filler: boolean;
    defaultValue: string;

    constructor(content: string) {
        this.value = content;
        this.size = this.value.length;
        this.type = "String";
        this.signed = false;
        this.assumedDecimalPoint = false;
        this.filler = false;
        this.defaultValue = "SPACES";
        this.guessType();
    }

    isTypeOfString(): boolean {
        return this.type === "Alphabet" || this.type === "Alphanumeric";
    }

    getCobolType(): string {
        if (this.isFiller()) {
            return "PIC X(" + this.size + ") VALUE " + this.defaultValue;
        }
        // TODO complete cobol type
        return "PIC X(" + this.size + ") VALUE " + this.defaultValue;
    }

    setFiller(): void {
        this.filler = true;
        this.type = "Filler";
    }

    isFiller(): boolean {
        return this.filler;
    }

    clone(): Cell {
        let newCell = new Cell("");
        newCell.size = this.size;
        newCell.type = this.type;
        newCell.value = this.value;
        newCell.signed = this.signed;
        newCell.assumedDecimalPoint = this.assumedDecimalPoint;
        return newCell;
    }

    // Does this cell COVER the given cell, i.e. is 
    // this cell more general or equal to the given cell.
    covers(cell: Cell): boolean {
        if (this.type !== cell.type) {
            if (this.type === "Numeric" && cell.type === "Float") {
                return false;
            }
            // else Float does cover Numeric
        }
        if (this.size < cell.size) { return false; }
        if (this.signed !== cell.signed) {
            if (this.signed === false && cell.signed === true) {
                return false;
            }
            // a signed number covers a non-signed number
        }
        if (this.assumedDecimalPoint !== cell.assumedDecimalPoint) {
            if (this.assumedDecimalPoint === false && cell.assumedDecimalPoint === true) {
                return false;
            }
            // a cell with a . in covers a cell without a dot
        }
        return true;
    }

    guessType(): void {
        // ordering should always be most general to most specific
        if (CobolTypeInference.isFloat(this.value)) {
            this.type = "Float";
            this.assumedDecimalPoint = true;
            this.signed = CobolTypeInference.isSigned(this.value);
        } else if (CobolTypeInference.isNumeric(this.value)) {
            this.type = "Numeric";
            this.signed = CobolTypeInference.isSigned(this.value);
        } else if (CobolTypeInference.isCurrency(this.value)) {
            this.type = "Currency";
        } else {
            if (CobolTypeInference.isAlphaNumeric(this.value)) {
                this.type = "AlphaNumeric";
            }
            if (CobolTypeInference.isAlphabet(this.value)) {
                this.type = "Alphabet";
            }
        }

    }

    toString() {
        return "'" + this.value + "' : " + this.type + "(" + this.size + ")";
    }
}
