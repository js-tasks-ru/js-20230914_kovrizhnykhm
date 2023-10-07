/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr) {
    const result = [];
    if (!Array.isArray(arr)) return result;
    for (const value of arr) {
      if (!result.includes(value)) {
        result.push(value);
      }
    }
    return result;
  }