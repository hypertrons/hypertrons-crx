export function elementExists(obj: any) {
    return Number.isInteger(obj.length) && obj.length > 0;
}

export function getMetaContent(index: any) {
    var ele = document.getElementsByTagName('meta')[index];
    if (ele && ele.content) {
        return ele.content;
    }
    return null;
}

export function isNull(object: any) {
    if (
        object === null ||
        typeof object === 'undefined' ||
        object === '' ||
        JSON.stringify(object) === '[]'
    ) {
        return true;
    }
    return false;
}
