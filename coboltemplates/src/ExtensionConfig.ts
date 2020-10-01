import { TemplateConfig } from "./TemplateConfig";
import * as vscode from 'vscode';
import * as path from 'path';

export class ExtensionConfig {
    author: string;
    templates: Array<TemplateConfig>;
    filenameReplacements: Map<string, string>;
    extensionPath: string;
    userPath: string | undefined;
    fileSectionTag: string;

    constructor() {
        this.author = "";
        this.templates = new Array<TemplateConfig>();
        this.filenameReplacements = new Map<string, string>();
        this.extensionPath = path.resolve(__dirname, "../../");
        this.userPath = undefined;
        this.fileSectionTag = "INPUT-RECORD-STRUCT";
    }

    getFileSectionTag(): string {
        return this.fileSectionTag;
    }

    setUserPath(path: string) {
        this.userPath = path;
    }

    getCurrentWorkspaceFolder(): string {
        if ( this.userPath !== undefined ) {
            return this.userPath!;
        }
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if ( !workspaceFolders ) {
            return this.extensionPath;
        }
        return workspaceFolders[0].uri.fsPath;
    }

    find(selected : any ) {
        for( let template of this.templates ) {
            if ( template.title === selected.title ) {
                return template;
            }
        }
        throw Error("Failed to find selected template '"+selected.title+"'.");
    }

    unserialise(config: vscode.WorkspaceConfiguration) {
        if (config.has("author")) {
            this.author = config.author;
        }
        if ( config.has("templates")) {
            let templates : any = config.get("templates");
            for ( let template of templates ) {
                let newTemplate = new TemplateConfig();
                if (template.hasOwnProperty("title")) {
                    newTemplate.title = template.title;
                }
                if (template.hasOwnProperty("cobol")) {
                    newTemplate.cobol = template.cobol;
                }
                if (template.hasOwnProperty("jcl")) {
                    newTemplate.jcl = template.jcl;
                }
                this.templates.push( newTemplate );
            }
        }
        if (config.has("filename_replacements")) {
            for ( let key in config.filename_replacements ) {
                let val = config.filename_replacements[key];
                this.filenameReplacements.set( key, val );
            }
        }
    }
}

