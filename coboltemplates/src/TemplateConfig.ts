// In the Properties.json file of the extension there is a "templates" key.
// The key points to an array of templates.
// This class is the object version of the data in that array.
export class TemplateConfig {
    title: string;
    cobol: string;
    jcl: string;
    constructor() {
        this.title = "";
        this.cobol = "";
        this.jcl = "";
    }
}
