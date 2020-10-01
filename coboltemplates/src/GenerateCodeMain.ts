import { ExtensionConfig } from "./ExtensionConfig";
import { DataFileFormatConfig } from "./DataFileFormatConfig";
import { DataFileReader } from "./DataFileReader";
import { CobolFileControlReader } from "./CobolFileControlReader";
import { CobolFileSectionWriter } from "./CobolFileSectionWriter";
import { OutputFileWriter } from "./OutputFileWriter";
import { CobolCodeWriter } from "./CobolCodeWriter";
import { JclCodeWriter } from "./JclCodeWriter";
import { InferredDataFileFormat } from "./InferredDataFileFormat";
import { checkForTags, basename, dirname } from "./UssFileUtils";
import * as vscode from 'vscode';
import { isDatasetPath } from "./DataSets";
import * as ZoweExplorerApi from "./api/ZoweExplorerApi";
import { IProfileLoaded, Session } from "@zowe/imperative";
import * as zowe from "@zowe/cli";
import { IZoweSessionManager } from './api/IZoweSessionManager';
import { TemplateConfig } from "./TemplateConfig";

export function generateCodeMain(extensionSettings: ExtensionConfig, selectedTemplate: TemplateConfig, dataFilePath: string) {
    generateCode(extensionSettings, selectedTemplate, dataFilePath).then((state) => {
        // open up a window for each output for user editing and review
        if (state.has("cobolOutputFile")) {
            const value = state.get("cobolOutputFile");
            if ( value ) {
                vscode.window.showTextDocument(vscode.Uri.parse(value));
            }
        }
        return state;
    }).then((state) => {
        if (state.has("cobolOutputFile")) {
            vscode.commands.executeCommand("workbench.action.keepEditor");
        }
        return state;
    }).then((state) => {
        if (state.has("jclOutputFile")) {
            const value = state.get("jclOutputFile");
            if ( value ) {
                vscode.window.showTextDocument(vscode.Uri.parse(value));
            }
        }
        return state;
    }).then((state) => {
        if (state.has("jclOutputFile")) {
            vscode.commands.executeCommand("workbench.action.keepEditor");
        }
        return state;
    }).then((state) => {
        giveUserFeedbackOnCompletion(dataFilePath, state);
        return state;
    }).catch((error) => {
        vscode.window.showErrorMessage(error);
    });
}

async function generateCode(config: ExtensionConfig, selected: TemplateConfig, dataFilePath: string): Promise<Map<string, string>> {
    console.log("Begin generating code");
    const tag = config.getFileSectionTag();
    // set the default way to read the data 
    // assumes a space separated column data, maybe with headers and footers
    let fileReaderConfig = new DataFileFormatConfig();

    // parse the data and lock on to the format
    let f = new DataFileReader(dataFilePath, fileReaderConfig);
    f.read();
    let inferredDataFileFormat: InferredDataFileFormat = f.parse();

    // we also need to get the file format which we get from the template
    let fileControlReader = new CobolFileControlReader();
    let fileControlFormats = fileControlReader.getFileControlFormats(selected);
    
    // Transform the data spec found in fileFormat into a File
    let fileSectionWriter = new CobolFileSectionWriter();
    let cobolFileSectionStructs = inferredDataFileFormat.transform(fileSectionWriter, fileControlFormats);

    // Load the template we want to use
    let templateWriter = new OutputFileWriter(config, selected);

    // add our FileSection structures to our template tags
    // TODO remove this hard coded tag that is replaced with file section structures
    //const tag = config.getFileSectionTag();
    templateWriter.addTag(tag, cobolFileSectionStructs);

    // write out template templates as Cobol and JCL
    let filesCreatedCount = 0;
    let filesCreationStatus: Map<string, string> = new Map<string, string>();
    if (templateWriter.selectedTemplate.cobol) {
        let cobolCodeWriter = new CobolCodeWriter(templateWriter.selectedTemplate.cobol);
        let cobolOutputFile = templateWriter.write(dataFilePath, cobolCodeWriter);
        filesCreatedCount++;
        filesCreationStatus.set("cobolOutputFile", cobolOutputFile);
        vscode.window.showInformationMessage("Created " + cobolOutputFile);
    }
    if (templateWriter.selectedTemplate.jcl) {
        let jclCodeWriter = new JclCodeWriter(templateWriter.selectedTemplate.jcl);
        let jclOutputFile = templateWriter.write(dataFilePath, jclCodeWriter);
        filesCreatedCount++;
        filesCreationStatus.set("jclOutputFile", jclOutputFile);
        vscode.window.showInformationMessage("Created " + jclOutputFile);
    }
    if (filesCreatedCount > 0) {
        vscode.window.showInformationMessage("Completed generating code, created " + filesCreatedCount + " files.");
    }
    return new Promise<Map<string, string>>(() => filesCreationStatus);
}

function giveUserFeedbackOnCompletion(dataFilePath: string, state: Map<string, string>) {
    if ( !checkIfUploadIsAllowed() ) {
        vscode.window.showInformationMessage("Code generation is completed.");
        return;
    }
    // if we find zowe on the current machine:
    // if the only {{ }} found is the JCL INPUT-DATASET then we can ask the user 
    // where they want us to upload the files to.
    if (state.has("cobolOutputFile")) {
        let cobolOutputFile = state.get("cobolOutputFile");
        if ( cobolOutputFile ) {
            uploadFileToMainframe(dataFilePath, cobolOutputFile);
        }
    }
    if (state.has("jclOutputFile")) {
        let jclOutputFile = state.get("jclOutputFile");
        if ( jclOutputFile ) {
            const datasetPath = uploadFileToMainframe(dataFilePath, jclOutputFile);
            vscode.window.showInformationMessage("Submitting job "+datasetPath);
            submitJobToMainframe(datasetPath).catch((error) => {
                vscode.window.showErrorMessage(error);
            });
        }
    }
}

function checkIfUploadIsAllowed(): boolean {
    let extensionSettings = vscode.workspace.getConfiguration("coboltemplates");
    let useZowe: boolean = extensionSettings.get("useZowe") || false;
    if (!useZowe) {
        return false;
    }
    const uploadOnSuccess = extensionSettings.get("uploadOnSuccess");
    if (!uploadOnSuccess) {
        return false;
    }
    return true;
}

function uploadFileToMainframe(dataFilePath: string, fileToUpload: string): string {
    let tagsExist = checkForTags(fileToUpload);
    if (tagsExist) {
        throw Error("There are still tags in '" + fileToUpload + "', human assistance required.");
    }
    let defaultDest: string = "";
    if (isDatasetPath(basename(dataFilePath))) {
        defaultDest = basename(dataFilePath);
        if (defaultDest.indexOf("(") !== -1) {
            // remove member from dataset path
            defaultDest = defaultDest.substr(0, defaultDest.indexOf("("));
        }
    }
    let datasetPath = "";
    vscode.window.showInputBox({
        "prompt": "Where would you like to upload your dataset to?",
        "value": defaultDest,
        "ignoreFocusOut": true
    }).then((response: string | undefined) => {
        response = response?.trim();
        if (response && response.length > 0) {
            datasetPath = response + "(" + basename(fileToUpload) + ")";
            console.log("Uploading to " + datasetPath);
            const zoweExplorerExtensionApi = vscode.extensions.getExtension("zowe.vscode-extension-for-zowe");
            if (!zoweExplorerExtensionApi || !zoweExplorerExtensionApi.exports) {
                throw Error("Zowe Explorer extension api was not found");
            }
            const importedApi: ZoweExplorerApi.ZoweExplorerApi.IApiExplorerExtender = zoweExplorerExtensionApi.exports;
            //const explorerExtensionApi = importedApi.getExplorerExtenderApi();
            importedApi.getSessionManager().then((sessionManager: IZoweSessionManager) => {
                console.log("Loaded session manager");
                sessionManager.loadProfiles();
                const profiles: Map<string, IProfileLoaded> = sessionManager.getProfiles();
                console.log(profiles);
                const profile = sessionManager.getProfile(Array.from(profiles.keys())[0]);
                importedApi.uploadDataset(profile, fileToUpload, datasetPath);
            });
        }
    });
    return datasetPath;
}

async function submitJobToMainframe(jclDatasetPath:string): Promise<zowe.IJob> {
    console.log("jcl submit: "+jclDatasetPath);
    const zoweExplorerExtensionApi = vscode.extensions.getExtension("zowe.vscode-extension-for-zowe");
    if (!zoweExplorerExtensionApi || !zoweExplorerExtensionApi.exports) {
        throw Error("Zowe Explorer extension API not found.");
    }
    const zoweExplorerJobApi: ZoweExplorerApi.ZoweExplorerApi.IJes = zoweExplorerExtensionApi.exports;
    return zoweExplorerJobApi.submitJob("Z00418.WORK(RDDATJCL)");
}