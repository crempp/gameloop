'use strict';
var path = require('path');

/**
 * Adds commas to a number
 * @param {number} number
 * @param {string} locale
 * @return {string}
 */
function sdf(number, locale) {
  return number.toLocaleString(locale);
};

console.log("In the gameloop");
console.log(path);