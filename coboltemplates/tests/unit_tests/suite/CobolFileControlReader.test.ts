import * as assert from 'assert';
import { CobolFileControlReader } from "../../../src/CobolFileControlReader";
import { CobolFileType } from "../../../src/CobolFileControlFormat";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

suite('CobolFileControlReader Test Suite', () => {
	

	test("can read file-control single line SELECT", () => {
		let val = "SELECT INFL ASSIGN TO INFLDD ORGANIZATION IS SEQUENTIAL FILE STATUS FS-INFL.";
		let fileControlReader = new CobolFileControlReader();
		let fileControlFormat = fileControlReader.parse(val);
		assert.strictEqual(fileControlFormat?.physicalFile, "INFLDD");
		assert.strictEqual(fileControlFormat?.logicalFile, "INFL");
		assert.strictEqual(fileControlFormat?.fileStatus, "FS-INFL");
	});

	test("can read file-control multiline SELECT", () => {
		let val = "SELECT INFL ASSIGN TO INFLDD\nORGANIZATION IS SEQUENTIAL\nFILE STATUS FS-INFL.";
		let fileControlReader = new CobolFileControlReader();
		let fileControlFormat = fileControlReader.parse(val);
		assert.strictEqual(fileControlFormat?.physicalFile, "INFLDD");
		assert.strictEqual(fileControlFormat?.logicalFile, "INFL");
		assert.strictEqual(fileControlFormat?.fileStatus, "FS-INFL");
	});

    test("can read file-control single line SELECT", () => {
		let val = "SELECT IN-REC-1 ASSIGN TO INDATASET1.";
		let fileControlReader = new CobolFileControlReader();
        let fileControlFormat = fileControlReader.parse(val);
        assert.strictEqual(fileControlFormat?.fileType, CobolFileType.sequential);
		assert.strictEqual(fileControlFormat?.physicalFile, "INDATASET1");
		assert.strictEqual(fileControlFormat?.logicalFile, "IN-REC-1");
		assert.strictEqual(fileControlFormat?.fileStatus, "");
	});

    

	
});
