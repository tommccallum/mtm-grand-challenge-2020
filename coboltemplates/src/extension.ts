// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { generateCodeMain } from './GenerateCodeMain';
import { ExtensionConfig } from "./ExtensionConfig";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "coboltemplates" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('coboltemplates.generateCode', () => {

		// The code you place here will be executed every time your command is executed
		if ( vscode.window.activeTextEditor ) {
			let extensionSettings = vscode.workspace.getConfiguration('coboltemplates');
			let currentFileInEditor = vscode.window.activeTextEditor.document.fileName;
			console.log(currentFileInEditor);
			let templates : any  = extensionSettings.get("templates");
			let items : Array<string> = [];
			for( let template of templates ) {
				items.push( template.title );
			}

			let config = new ExtensionConfig();
        	config.unserialise( extensionSettings );
			config.setUserPath(__dirname);
		
			// TODO get all filenames (without extension) from templates directory
			// and ask user to pick which they want
			vscode.window.showQuickPick(items, { canPickMany: false }).then((value) => {
				if ( value ) {
					// create new files
					console.log(value);
					let selectedTemplate = null;
					for( let template of templates ) {
						if ( template.title === value ) {
							selectedTemplate = template;
							break;
						}
					}
					if ( selectedTemplate ) {
						let selected = config.find(selectedTemplate);
						// we are going to call our code now
						generateCodeMain(config, selected, currentFileInEditor);
					}
				}
			});
			// vscode.window.showInformationMessage(value);
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
