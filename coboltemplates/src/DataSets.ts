
export function isDatasetPath(str:string) : boolean {
    console.log("isDataset: "+str);
    let parts = str.split(".");
    let segmentRegExp = new RegExp("^[A-Z][A-Z0-9]{0,7}$");
    let memberRegExp = new RegExp("^[A-Z][A-Z0-9]{0,7}\\([A-Z][A-Z0-9]{0,7}\\)$");
    let isValid = true;
    for( let ii=0; ii < parts.length; ii++ ) {
        if ( ii === parts.length-1 ) {
            // last part can be a member
            if ( !segmentRegExp.test(parts[ii]) && !memberRegExp.test(parts[ii]) ) {
                isValid = false;
                break;
            }
        } else {
            if ( !segmentRegExp.test(parts[ii]) ) {
                isValid = false;
                break;
            }
        }
    }
    return isValid;
}
