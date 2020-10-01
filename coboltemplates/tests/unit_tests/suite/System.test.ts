import * as assert from 'assert';
import { ExtensionConfig } from "../../../src/ExtensionConfig";
import { DataFileFormatConfig } from "../../../src/DataFileFormatConfig";
import { DataFileReader } from "../../../src/DataFileReader";
import { CobolFileControlReader } from "../../../src/CobolFileControlReader";
import { CobolFileSectionWriter } from "../../../src/CobolFileSectionWriter";
import { OutputFileWriter } from "../../../src/OutputFileWriter";
import { CobolCodeWriter } from "../../../src/CobolCodeWriter";
import { JclCodeWriter } from "../../../src/JclCodeWriter";
import { InferredDataFileFormat } from "../../../src/InferredDataFileFormat";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../../src/extension';
import * as path from 'path';

suite('System Test Suite', () => {
	
	test('Rocks1 - write Cobol', () => {
		// the dataset in IBM Z VSC plugin will be the 
        let extensionSettings : vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('coboltemplates');
        
        // Get the VS Code options we have set and put them into a usable form
		let config = new ExtensionConfig();
        config.unserialise( extensionSettings );
        config.setUserPath(__dirname);
        // pretend our user has selected the read_data template
        let selected = config.templates[0];
        selected.cobol = path.resolve(__dirname, "../../../../"+selected.cobol);
        selected.jcl = path.resolve(__dirname, "../../../../"+selected.jcl);

        // pretend out user has selected rocks3.txt as their data
        let filePath = path.resolve(__dirname,"../../../../resources/example_data/rocks3.txt");			
        
        // set the default way to read the data 
        // assumes a space separated column data, maybe with headers and footers
        let fileReaderConfig = new DataFileFormatConfig();
        
		// parse the data and lock on to the format
		let f = new DataFileReader(filePath, fileReaderConfig);
		f.read();
		let inferredDataFileFormat : InferredDataFileFormat = f.parse();

		// we also need to get the file format which we get from the template
		let fileControlReader = new CobolFileControlReader();
        let fileControlFormats = fileControlReader.getFileControlFormats(selected);
        assert.strictEqual(fileControlFormats.length, 1 );

        // Transform the data spec found in fileFormat into a File
        let fileSectionWriter = new CobolFileSectionWriter();
        let cobolFileSectionStructs = inferredDataFileFormat.transform(fileSectionWriter, fileControlFormats);
        
        // Load the template we want to use
        let templateWriter = new OutputFileWriter(config, selected);
        
        // add our FileSection structures to our template tags
        templateWriter.addTag(config.getFileSectionTag(), cobolFileSectionStructs);
        
        // write out template templates as Cobol and JCL
        if ( templateWriter.selectedTemplate.cobol ) {
		    let cobolCodeWriter = new CobolCodeWriter(templateWriter.selectedTemplate.cobol);
            templateWriter.write(filePath, cobolCodeWriter);
        }
        if ( templateWriter.selectedTemplate.jcl ) {
		    let jclCodeWriter = new JclCodeWriter(templateWriter.selectedTemplate.jcl);
            templateWriter.write(filePath, jclCodeWriter);
        }
	});
	
});

