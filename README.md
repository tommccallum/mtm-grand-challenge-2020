*** PROJECT DISCONTINUED ***


# MTM Grand Challenge 2020

This small project was created for the IBM Master-The-Mainframe Grand Challenge 2020.  During the competition I found having to create and modify File Sections in Cobol a very frustrating experience, and so the idea of generating the File Section directly was born.  

## What does it do?

The objective was given an input file of data, automatically generate a matching File Section header and place this in a Cobol template.  This template could be run directly as the extension also generates an associated JCL file which can be submitted. 

* The user can select either a local file or a remote file through Zowe.
* The user then selects from the Command Palette the option "Generate Cobol and JCL code for data file".
* If the data file is local to the users system, it will save the file in the project folder with a name suitable for use on IBM Z Mainframe.  In this case there may be user intevention required to complete the JCL file as the program does not know where it will be run.
* If the data file is a mainframe dataset, it will generate the files in the project folder, upload them to the mainframe in a user specified directory, and then submit the JCL file directly.

## How do I install it?

This project consists of 2 Visual Studio code extensions.  The first is a modified vscode-extension-for-zowe that I have modified to provide additional functionality described below.  The second is the CobolTemplates extension.

* In visual studio click on the Extension icon on the left hand side.
* Select the 3 dots in the top right of the extension bar.
* Select "Install from VSIX..." and select each vsix extension file.

## Modifications to vscode-extension-for-zowe

I have modified this extension to allow an external plugin to not have to use the internal tree structure to upload files and submit jobs.  This allows my plugin to created files and then upload them and submit the JCL file directly rather requiring user intervention. 

## Thank you

Many thanks to Peter Haumer at IBM for his help and advice on how to get started on modifying the Zowe Explorer extension of the project.

