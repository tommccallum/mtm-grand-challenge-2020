
import {CobolFileControlFormat, CobolFileType } from "./CobolFileControlFormat";
import {TemplateConfig} from "./TemplateConfig";
import {readFileSync} from 'fs';

export class CobolFileControlReader {
    constructor() {

    }

    parse(selectStatement: string) : CobolFileControlFormat | null {
        let fileControlFormat = new CobolFileControlFormat();
        let newlineReplacement = /\n/g;
        selectStatement = selectStatement.replace(newlineReplacement, " ");
        selectStatement = selectStatement.trim();
        selectStatement = selectStatement.substr(0, selectStatement.length - 1);
        let tokens = selectStatement.split(" ");
        let ii =0 ;
        while ( ii < tokens.length) {
            if ( ii < tokens.length - 2 && tokens[ii] === "SELECT" ) {
                fileControlFormat.logicalFile = tokens[ii+1];
                ii+=2;
            } else if ( ii < tokens.length - 2 && tokens[ii] === "ASSIGN" && tokens[ii+1] === "TO" ) {
                fileControlFormat.physicalFile = tokens[ii+2];
                ii += 3;
            } else if ( ii < tokens.length - 2 && tokens[ii] === "ORGANIZATION"  && tokens[ii+1] === "IS" && tokens[ii+2] === "SEQUENTIAL" ) {
                fileControlFormat.fileType = CobolFileType.sequential;
                ii += 3;
            } else if ( ii < tokens.length - 2 && tokens[ii] === "FILE" && tokens[ii+1] === "STATUS" ) {
                fileControlFormat.fileStatus = tokens[ii+2];
                ii += 3;
            } else {
                ii++;
            }
        }
        return fileControlFormat;
    }

    getFileControlFormats(template : TemplateConfig ) : Array<CobolFileControlFormat> {
        let content = readFileSync(template.cobol, "utf-8");
        return this.getFileControlFormatsFromString(content);
    }

    getFileControlFormatsFromString(content: string ) : Array<CobolFileControlFormat> {
        let fileControlFormats = new Array<CobolFileControlFormat> ();
        if ( content.trim().length === 0 ) {
            throw Error("No content found in template to create File Control statement from.");
        }
        let lines = content.split("\n");
        let inFileControlSection = false;
        let fileControlRegExp = new RegExp(/^\s*FILE-CONTROL\.\s*$/);
        let commentRegExp = new RegExp(/^\s*\*/);
        let multilineSelectStatement = "";
        for( let ii=0 ; ii <lines.length ;ii++ ) {
            if ( lines[ii].trim().length === 0 ) { // ignore blank lines
                continue;
            }
            if ( fileControlRegExp.test(lines[ii]) ) { // check if we are in control section yet
                inFileControlSection = true;
                continue;
            }
            if ( inFileControlSection ) {
                if ( !commentRegExp.test(lines[ii]) ) {
                    let selectStatement = lines[ii].trim();
                    if ( selectStatement.substr(0,7) === "SELECT " ) {
                        multilineSelectStatement = selectStatement;

                        // is this a single line SELECT statement or a multiline
                        if ( multilineSelectStatement.substr(multilineSelectStatement.length-1,1) === "." ) {
                            let fileFormat : CobolFileControlFormat | null = this.parse(multilineSelectStatement);
                            if ( fileFormat !== null ) {
                                fileControlFormats.push( fileFormat );
                            }
                            multilineSelectStatement = "";
                        }
                    } else{
                        if ( multilineSelectStatement.length !== 0 ) {
                            // if we are still looking for rest of SELECT statement
                            // then we check for . at end of statement
                            if ( selectStatement.substr(selectStatement.length-1,1) === "." ) {
                                multilineSelectStatement += selectStatement;
                                let fileFormat : CobolFileControlFormat | null = this.parse(selectStatement);
                                if ( fileFormat !== null ) {
                                    fileControlFormats.push( fileFormat );
                                }
                            } else {
                                multilineSelectStatement += " " + selectStatement;
                            }
                        } else {
                            // anything other than select statements we say indicates
                            // the send of the FileControl paragraph.
                            inFileControlSection = false;
                            break;
                        }
                    }
                }
            }
        }

        return fileControlFormats;
    }
}
