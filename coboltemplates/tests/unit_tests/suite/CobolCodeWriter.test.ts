import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';
import { CobolCodeWriter } from "../../../src/CobolCodeWriter";
import * as path from 'path';

suite('CobolCodeWriter Test Suite', () => {
	
	test('read_data.cobol - get tags from cobol file', () => {
		const cobolFilePath = path.resolve(__dirname, "../../../../resources/templates/read_data.cobol");
		let cobolWriter = new CobolCodeWriter(cobolFilePath);
		let tags = new Map<string,string>();
		let foundTags : Set<string> = cobolWriter.findTags();
		assert.strictEqual(foundTags.size, 3);
		assert.strictEqual(foundTags.has("COBOL-NAME"), true);
		assert.strictEqual(foundTags.has("AUTHOR"), true);
		// assert.strictEqual(foundTags.has("INPUT-RECORD"), true);
		// assert.strictEqual(foundTags.has("INPUTFILE"), true);
		assert.strictEqual(foundTags.has("INPUT-RECORD-STRUCT"), true);
	});
});
