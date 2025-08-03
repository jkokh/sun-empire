export function flatten(
    nestedObj: any,
    parentKey = '',
    result: Record<string, string> = {}
): Record<string, string> {
    for (const key in nestedObj) {
        const propName = parentKey ? `${parentKey}.${key}` : key;
        if (typeof nestedObj[key] === 'object' && nestedObj[key] !== null) {
            flatten(nestedObj[key], propName, result);
        } else {
            result[propName] = nestedObj[key];
        }
    }
    return result;
}
