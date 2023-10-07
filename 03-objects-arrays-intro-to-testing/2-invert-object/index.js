/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {

let obj2 = {};
for (let keys in obj) {
    if (obj.hasOwnProperty(keys)) {
        obj2[obj[keys]] = keys;
    }
}

if (typeof(obj) === 'object'){
     return obj2;}
     else return obj;
}