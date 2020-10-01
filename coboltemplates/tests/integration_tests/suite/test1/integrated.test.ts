import * as assert from 'assert';
import { ExtensionConfig } from "../../../../src/ExtensionConfig";
import { DataFileFormatConfig } from "../../../../src/DataFileFormatConfig";
import { DataFileReader } from "../../../../src/DataFileReader";
import { CobolFileControlReader } from "../../../../src/CobolFileControlReader";
import { CobolFileSectionWriter } from "../../../../src/CobolFileSectionWriter";
import { OutputFileWriter } from "../../../../src/OutputFileWriter";
import { CobolCodeWriter } from "../../../../src/CobolCodeWriter";
import { JclCodeWriter } from "../../../../src/JclCodeWriter";
import { InferredDataFileFormat } from "../../../../src/InferredDataFileFormat";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../../src/extension';
import * as path from 'path';
import { generateCodeMain } from "../../../../src/GenerateCodeMain";
import { existsSync } from 'fs';

suite('Integration Test', () => {
	
	test('when file with single line which is a string', () => {
        // the dataset in IBM Z VSC plugin will be the 
        let extensionSettings : vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('coboltemplates');
        // Get the VS Code options we have set and put them into a usable form
		let config = new ExtensionConfig();
        config.unserialise( extensionSettings );
        config.setUserPath(__dirname);
        // pretend our user has selected the read_data template
        let selected = config.templates[0];
        selected.cobol = path.resolve(__dirname, "../../../../../"+selected.cobol);
        selected.jcl = path.resolve(__dirname, "../../../../../"+selected.jcl);

        // pretend out user has selected rocks3.txt as their data
        let filePath = path.resolve(__dirname,"./helloworld.txt");			
        
        try {
            generateCodeMain(config, selected, filePath);
            // assert.ok( existsSync(path.resolve(__dirname,"./HLLWCBL")) );
            // assert.ok( existsSync(path.resolve(__dirname,"./HLLWJCL")) );
        } catch( error ) {
            console.log(error);
            assert.ok(false);
        }
        
	});
	
});

