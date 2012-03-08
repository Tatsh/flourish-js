/**
 * Provides cryptography functions.
 * Copyright (c) 2012 StonerAries.
 * @constructor
 */
var fCryptography = function () {};
/**
 * Generates a random number.
 * @param {number} [min=0] The minimum number to generate.
 * @param {number} [max=1] The maximum number to generate.
 * @returns {number} A random number.
 */
fCryptography.random = function (min, max) {
  min = parseInt(min, 10);
  max = parseInt(max, 10);

  if(!isNaN(min) && !isNaN(max)) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  return Math.random();
};
/**
 * Generates a random string.
 * @param {number} [length=32] The length you want the string to be.
 * @param {string} [type='base64'] The alphabet of string you want generated.
 *   One of: 'alphanumeric', 'base56', 'alpha', 'base36', 'hexadecimal',
 *   'numeric'.
 * @returns {string} Random string.
*/
fCryptography.randomString = function (length, type) {
  length === undefined && (length = 32);

  var digits = '0123456789';
  var abcdef = 'abcdef';
  var upperAlpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var alphabet = upperAlpha.toLowerCase() + upperAlpha + digits + '+/';
  var output = '';

  if (type !== undefined) {
    if (type === 'alphanumeric') {
      alphabet = upperAlpha.toLowerCase() + upperAlpha + digits;
    }
    else if (type === 'base56') {
      alphabet = upperAlpha.toLowerCase() + upperAlpha + digits.substr(2);
    }
    else if (type === 'alpha') {
      alphabet = upperAlpha.toLowerCase() + upperAlpha;
    }
    else if (type === 'base36') {
      alphabet = upperAlpha + digits;
    }
    else if (type === 'hexadecimal') {
      alphabet = abcdef + digits;
    }
    else if (type === 'numeric') {
      alphabet = digits;
    }
  }

  for (var i = 0, alphaLen = alphabet.length - 1; i < length; i++) {
    output += alphabet.charAt(fCryptography.random(0, alphaLen));
  }

  return output;
};
