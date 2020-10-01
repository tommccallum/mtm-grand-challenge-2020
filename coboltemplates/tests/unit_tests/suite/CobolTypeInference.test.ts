import * as assert from 'assert';
import { Cell } from "../../../src/Cell";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

suite('CobolTypeInference Test Suite', () => {
	
	test('Given nonsigned numeric cell WHEN compared with a signed numeric cell THEN true ', () => {
		let cellA = new Cell("9");
		let cellB = new Cell("-9");
		assert.strictEqual(cellA.covers(cellB), false);
		assert.strictEqual(cellB.covers(cellA), true);
	}); 

	test('Given string WHEN compared with a numeric THEN false ', () => {
		let cellA = new Cell("hello");
		let cellB = new Cell("-9");
		assert.strictEqual(cellA.covers(cellB), false);
		assert.strictEqual(cellB.covers(cellA), false);
	}); 

	test('Given string WHEN compared with a float THEN false ', () => {
		let cellA = new Cell("hello");
		let cellB = new Cell("9.5");
		assert.strictEqual(cellA.covers(cellB), false);
		assert.strictEqual(cellB.covers(cellA), false);
	}); 

	test('Given string WHEN compared with string of same size THEN false ', () => {
		let cellA = new Cell("hello");
		let cellB = new Cell("world");
		assert.strictEqual(cellA.covers(cellB), true);
		assert.strictEqual(cellB.covers(cellA), true);
	}); 

	test('Given string WHEN compared with string of larger size THEN false ', () => {
		let cellA = new Cell("hello");
		let cellB = new Cell("world2");
		assert.strictEqual(cellA.covers(cellB), false);
		assert.strictEqual(cellB.covers(cellA), true);
	}); 

	test('Given float WHEN compared with float of same sign and length THEN true ', () => {
		let cellA = new Cell("39.546");
		let cellB = new Cell("42.342");
		assert.strictEqual(cellA.covers(cellB), true);
		assert.strictEqual(cellB.covers(cellA), true);
	}); 

	test('Given float WHEN compared with float of same sign and longer length THEN false ', () => {
		let cellA = new Cell("39.546");
		let cellB = new Cell("42.3423");
		assert.strictEqual(cellA.covers(cellB), false);
		assert.strictEqual(cellB.covers(cellA), true);
	}); 

	test('Given float WHEN compared with float of different sign and longer length THEN false ', () => {
		let cellA = new Cell("39.546");
		let cellB = new Cell("-42.3423");
		assert.strictEqual(cellA.covers(cellB), false);
		assert.strictEqual(cellB.covers(cellA), true);
	}); 

	test('Given float WHEN compared with float of different sign and same length THEN false ', () => {
		let cellA = new Cell("39.546");
		let cellB = new Cell("-42.343");
		assert.strictEqual(cellA.covers(cellB), false);
		assert.strictEqual(cellB.covers(cellA), true);
	}); 


});
