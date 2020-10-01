import { ExtensionConfig } from "./ExtensionConfig";
import { TemplateConfig } from "./TemplateConfig";
import { basename, dirname } from "./UssFileUtils";
import { JclCodeWriter } from "./JclCodeWriter";
import { CobolCodeWriter } from "./CobolCodeWriter";
import { isDatasetPath } from "./DataSets";
import * as vscode from 'vscode';

export class OutputFileWriter {
    config: ExtensionConfig;
    defaultCobolDatasetName: string;
    defaultJclDatasetName: string;
    tags: Map<string, string>;
    selectedTemplate: TemplateConfig;

    constructor(config: ExtensionConfig, selectedTemplate: TemplateConfig) {
        this.config = config;
        this.selectedTemplate = selectedTemplate;
        this.defaultCobolDatasetName = "NEWCBL";
        this.defaultJclDatasetName = "NEWJCL";
        this.tags = new Map<string, string>();
        this.addTag("AUTHOR", config.author);
    }

    setTags(tags: Map<string, string>) {
        this.tags = tags;
    }

    addTag(tag: string, replacement: string) {
        this.tags.set(tag.toUpperCase(), replacement);
    }

    removeTag(tag: string) {
        this.tags.delete(tag.toUpperCase());
    }

    getTag(tag: string) {
        return this.tags.get(tag.toUpperCase());
    }

    hasTag(tag: string) {
        return this.tags.has(tag.toUpperCase());
    }

    getCobolDatasetMemberName() {
        let filename: string = basename(this.selectedTemplate.cobol);
        if (filename.length > 0) {
            let title: string = filename;
            if (title.length !== 0) {
                title = title.toUpperCase();
                title = title.replace(/[^A-Za-z0-9]/, '');
                this.config.filenameReplacements.forEach((value: string, key, string) => {
                    title = title.replace(key, value);
                });
                title = title.substr(0, 5) + "CBL";
                return title;
            }
        }
        return this.defaultCobolDatasetName;
    }

    getJclDatasetMemberName() {
        let filename: string = basename(this.selectedTemplate.cobol);
        if (filename.length > 0) {
            let title: string = filename;
            if (title.length !== 0) {
                title = title.toUpperCase();
                title = title.replace(/[^A-Za-z0-9]/, '');
                this.config.filenameReplacements.forEach((value: string, key, string) => {
                    title = title.replace(key, value);
                });
                title = title.substr(0, 5) + "JCL";
                return title;
            }
        }
        return this.defaultJclDatasetName;
    }

    getSaveDirectory(dataFilePath: string) {
        const folderPath = this.config.getCurrentWorkspaceFolder();
        let dataFileFolder = dirname(dataFilePath);

        // if we are in a dataset, save to the current project folder
        // otherwise save to same folder as data file.
        let savePath = folderPath;
        if (dataFileFolder.substr(0, folderPath?.length) !== folderPath) {
            savePath = folderPath;
        }
        return savePath;
    }

    write(dataFilePath: string, codeWriter: JclCodeWriter): string;
    write(dataFilePath: string, codeWriter: CobolCodeWriter): string {
        let baseFileName = basename(dataFilePath);
        let saveAsPath = this.getSaveDirectory(dataFilePath);
        if ( !saveAsPath ) {
            throw Error("cannot save to undefined path");
        }
        if (isDatasetPath(basename(dataFilePath))) {
            // we are good to proceed with the current name
            // as it has come from a IBM Z mainframe
            this.addTag("INPUT-DATASET", baseFileName);
        } else {
            // blank ELSE on purpose at this point.
            // we leave the original tag in for user to replace.
        }
        this.addTag("COBOL-NAME", this.getCobolDatasetMemberName());
        if (codeWriter.type === "JclCodeWriter") {
            this.addTag("JCL-NAME", this.getJclDatasetMemberName());
            codeWriter.replaceTags(this.tags);
            codeWriter.writeToFile(saveAsPath + "/" + this.getJclDatasetMemberName());
            console.log("Write JCL to " + saveAsPath + "/" + this.getJclDatasetMemberName());
            return saveAsPath+ "/" + this.getJclDatasetMemberName();
        } else if (codeWriter.type === "CobolCodeWriter") {
            codeWriter.replaceTags(this.tags);
            codeWriter.writeToFile(saveAsPath + "/" + this.getCobolDatasetMemberName());
            console.log("Write COBOL to " + saveAsPath + "/" + this.getCobolDatasetMemberName());
            return saveAsPath+ "/" + this.getCobolDatasetMemberName();
        } else {
            throw new Error("Unsupported CodeWriter object");
        }
        
    }
}
