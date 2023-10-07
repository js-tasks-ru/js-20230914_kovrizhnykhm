/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
let result = '';
if (size == 0) return result;
if (!size) return result = string;

let currentChar = '';
let currentCount = 0;

for (const char of string) {
    if (char !== currentChar) {
      currentChar = char;
      currentCount = 1;
    } else {
      currentCount++;
    }
    if (currentCount <= size) {
      result += char;
    }
  }

return result;
}
