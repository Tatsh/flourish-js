/**
 * Provides cryptography functions.
 * Copyright (c) 2012 StonerAries.
 * License: http://www.opensource.org/licenses/mit-license.php
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
}
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

  var alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/';
  var output = '';

  if (type !== undefined) {
    if (type === 'alphanumeric') {
      alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    }
    else if (type === 'base56') {
      alphabet = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    }
    else if (type === 'alpha') {
      alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    else if (type === 'base36') {
      alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    }
    else if (type === 'hexadecimal') {
      alphabet = 'abcdef0123456789';
    }
    else if (type === 'numeric') {
      alphabet = '0123456789';
    }
  }

  for (var i = 0, alphaLen = alphabet.length; i < length; i++) {
    output += alphabet.charAt(fCryptography.random(0, alphaLen));
  }

  return output;
};
