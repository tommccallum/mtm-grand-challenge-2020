import * as assert from 'assert';
import { ExtensionConfig} from "../../../src/ExtensionConfig";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

suite('ExtensionConfig Test Suite', () => {
	
	test('unserialise extension config', () => {
		let extensionSettings = vscode.workspace.getConfiguration('coboltemplates');
		let config = new ExtensionConfig();
		config.unserialise( extensionSettings );
		assert.strictEqual(config.templates.length, 2);
		assert.strictEqual(config.filenameReplacements.size, 4);
	});

	
});

	
