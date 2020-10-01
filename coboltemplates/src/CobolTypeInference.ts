
export function isNumeric(val: string) {
    let regexp = new RegExp("^[0-9]+$");
    return regexp.test(val);
}

export function isAlphabet(val: string) {
    let regexp = new RegExp("^[A-Za-z-\._ ]+$");
    return regexp.test(val);
}

export function isSigned(val: string) {
    let regexp = new RegExp("^[+-]");
    return regexp.test(val);
}

export function isAssumedDecimalPoint(val: string) {
    let regexp = new RegExp("\.");
    return regexp.test(val);
}



export function isAlphaNumeric(val: string) {
    let regexp = new RegExp("^[A-Za-z0-9]+$");
    return regexp.test(val);
}

export function isWholeNumber(val: string) {
    let regexp = new RegExp("^[0-9]+");
    return regexp.test(val);
}

export function isFloat(val: string) {
    let regexp = new RegExp("^[0-9]*\.[0-9]+");
    return regexp.test(val);
}

export function isCurrency(val: string) {
    let regexp = new RegExp("^[A-Za-z]{0,1}[$£]{0,1}[\d,]\.[0-9][0-9]");
    return regexp.test(val);
}

export function isDate(val: string) {
    let regexp = new RegExp("^[0-9]{1,4}[.-/][0-9]{1,2}[.-/][0-9]{1,4}");
    return regexp.test(val);
}

export function isTime(val: string) {
    let regexp = new RegExp("^[0-9]{1,2}:[0-9][0-9]");
    return regexp.test(val);
}
