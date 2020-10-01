import * as assert from 'assert';
import { isDatasetPath } from "../../../src/DataSets";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

suite('DataSets Test Suite', () => {
	
    test("is data Z00418.INPUT.ACT123 a dataset", () => {
		let val = "Z00418.INPUT.ACT123";
		assert.strictEqual(isDatasetPath(val), true);
	});

	test("is data Z00418.INPUT.(ACT123) a dataset", () => {
		let val = "Z00418.INPUT.(ACT123)";
		assert.strictEqual(isDatasetPath(val), false);
	});

	test("is data Z00418.INPUT(ACT123) a dataset", () => {
		let val = "Z00418.INPUT(ACT123)";
		assert.strictEqual(isDatasetPath(val), true);
	});

	test("is data Z00418.INPUT.(ACT123z) a dataset", () => {
		let val = "Z00418.INPUT.(ACT123z)";
		assert.strictEqual(isDatasetPath(val), false);
	});

	
});

	