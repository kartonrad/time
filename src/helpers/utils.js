export function filterObject (object={}, predicate) {
    var result = [];
    for (let key in object) {
        if(object.hasOwnProperty(key) && predicate(object[key])) {
            result[key] = object[key];
        }
    }
    return result;
}