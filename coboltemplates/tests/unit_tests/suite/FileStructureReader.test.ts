import * as assert from 'assert';
import { readFileSync } from "fs";
import { DataFileReader } from "../../../src/DataFileReader";
import { DataFileFormatConfig } from "../../../src/DataFileFormatConfig";
import * as path from 'path';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { stringify } from 'querystring';
import { timeStamp } from 'console';
// import * as myExtension from '../../extension';

suite('FileStructureReader Test Suite', () => {

	test('Read file test', () => {
		console.log(process.cwd());
		const filePath = path.resolve(__dirname, "../../../../resources/example_data/helloworld.txt");
		assert.strictEqual(readFileSync(filePath, "utf-8"), "Hello World");
	});

	test('Structure test - plain', () => {
		let config = new DataFileFormatConfig();
		const filePath = path.resolve(__dirname, "../../../../resources/example_data/helloworld.txt");
		let f = new DataFileReader(filePath, config);
		f.read();
		let fileFormat = f.parse();
		console.log(fileFormat);
	});

	test('Rocks1 - analyse', () => {
		let config = new DataFileFormatConfig();
		const filePath = path.resolve(__dirname, "../../../../resources/example_data/rocks1.txt");
		let f = new DataFileReader(filePath, config);
		f.read();
		let fileFormat = f.parse();
		assert.strictEqual(fileFormat.rowGroups.length, 1 );
		assert.strictEqual(fileFormat.rowGroups[0].columns[0].size, 17 );
	});

	test('Rocks2 - analyse', () => {
		let config = new DataFileFormatConfig();
		const filePath = path.resolve(__dirname, "../../../../resources/example_data/rocks2.txt");
		let f = new DataFileReader(filePath, config);
		f.read();
		let fileFormat = f.parse();
		assert.strictEqual(fileFormat.rowGroups.length, 1 );
		assert.strictEqual(fileFormat.rowGroups[0].columns[0].size, 21 );
	});

	test('Rocks3 - analyse', () => {
		let config = new DataFileFormatConfig();
		const filePath = path.resolve(__dirname, "../../../../resources/example_data/rocks3.txt");
		let f = new DataFileReader(filePath, config);
		f.read();
		let fileFormat = f.parse();
		assert.strictEqual(fileFormat.rowGroups.length, 1 );
		assert.strictEqual(fileFormat.rowGroups[0].columns[0].size, 12 );
	});


	

	


});
