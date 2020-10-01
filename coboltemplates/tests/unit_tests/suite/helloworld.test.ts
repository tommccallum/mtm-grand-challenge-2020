import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

suite('Helloworld Test Suite', () => {
	
	test('Hello world test', () => {
		assert.strictEqual("Hello world", "Hello world");
	});

	test("regex", () => {
		let fileControlRegExp = new RegExp(/^\s*FILE-CONTROL\.\s*$/);
		console.log(fileControlRegExp.test(" FILE-CONTROL."));

	});

	
});
