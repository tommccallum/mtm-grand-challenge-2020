
export enum CobolFileType {
    sequential = "SEQUENTIAL",
    index = "INDEX",
    relativeOrganisationalFile = "RELATIVE"
}

// https://www.tutorialbrain.com/mainframe/cobol_file_handling/
// DATA DIVISION.
// FILE SECTION.
// FD FILE-NAME.                                        
// [RECORD CONTAINS N characters]                       SUPPORTED
// [BLOCK CONTAINS I RECORDS]                           UNSUPPORTED
// [DATA RECORD IS RECORD-DET]                          UNSUPPORTED
// [RECORDING MODE IS {F/V/U}].                         SUPPORTED
export class CobolFileControlFormat {
    fileType : CobolFileType;
    recordingMode : string;
    minRecordWidth : number;
    maxRecordWidth : number;
    dataItemName : string;
    physicalFile : string;
    logicalFile : string;
    fileStatus : string;

    constructor() {
        this.fileType = CobolFileType.sequential;
        this.recordingMode = "F";
        this.minRecordWidth = 80;
        this.maxRecordWidth = 80;
        this.dataItemName = "";
        this.physicalFile = "";
        this.logicalFile = "";
        this.fileStatus = "";
    }

    setRecordWidth(n : number ) {
        this.minRecordWidth = n;
        this.maxRecordWidth = this.minRecordWidth;
    }

    setFixedLength() {
        this.recordingMode = "F";
    }

    setVariableLength() {
        this.recordingMode = "V";
    }

    setUnidentifiedLength() {
        this.recordingMode = "U";
    }

    toString() : string {
        let fileRecord = "FD "+this.logicalFile+" ";
        switch( this.recordingMode ) {
            case "F":
                return fileRecord+"RECORD CONTAINS "+this.maxRecordWidth+" CHARACTERS RECORDING MODE IS F.";
            case "V":
                return fileRecord+"RECORD CONTAINS SIZE "+this.minRecordWidth+" TO "+this.maxRecordWidth+" CHARACTERS RECORDING MODE IS V.";
            case "U":
                let out :string =  fileRecord+"RECORD IS VARYING IN SIZE "+this.minRecordWidth+" TO "+this.maxRecordWidth;
                if ( this.dataItemName.length > 0 ) {
                    out += " DEPENDING ON "+this.dataItemName;
                }
                out += " RECORDING MODE IS U";
                out += ".";
                return out;
        }
        return "";
    }
}
