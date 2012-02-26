/**
 * Provides notation conversion support.
 * Copyright 2012 Andrew Udvare.
 * License: http://www.opensource.org/licenses/mit-license.php
 * @constructor
 */
var fGrammar = function () {};
/**
 * Cache of strings that have been humanized.
 * @type Object
 * @private
 */
fGrammar._humanizeCache = {};
/**
 * Cache of strings that have been underscorized.
 * @type Object
 * @private
 */
fGrammar._underscorizeCache = {};
/**
 * Cache of strings that have been converted to camel case.
 * @type Object
 * @private
 */
fGrammar._camelizeCache = {
  upper: {},
  lower: {}
};
/**
 * @private
 * @param {string} str
 * @param {string} delimiter
 * @param {Object} cacheToCheck
 * @returns {string}
 */
fGrammar._commonize = function (str, delimiter, cacheToCheck) {
  if (cacheToCheck[str]) {
    return cacheToCheck[str];
  }

  var original = str;
  str = str.charAt(0).toLowerCase() + str.substr(1);

  if (str.indexOf('_') !== -1 && str.toLowerCase() === str) {
  }
  else if (str.indexOf(' ') !== -1) {
    str = str.replace(/\s+/g, '_').toLowerCase();
  }
  else {
    var old;
    do {
      old = str;
      str = str.replace(/([a-zA-Z])([0-9])/, '$1' + delimiter + '$2');
      str = str.replace(/([a-z0-9A-Z])([A-Z])/, '$1' + delimiter + '$2');
    } while (old !== str);

    str = str.toLowerCase();
  }

  cacheToCheck[original] = str;

  return str;
};
/**
 * Converts a <code>camelCase</code>, human-friendly or
 *   <code>underscore_notation</code> string to
 *   <code>underscore_notation</code>.
 * Port of fGrammar::underscorize() from Flourish.
 *
 * @param {string} str String to underscorize.
 * @returns {string} String, underscorized.
 */
fGrammar.underscorize = function (str) {
  return fGrammar._commonize(str, '_', fGrammar._underscorizeCache);
};
/**
 * Makes an <code>underscore_notation</code>, <code>camelCase</code>, or
 *   human-friendly string into a human-friendly string.
 * Port of fGrammar::humanize() from Flourish.
 *
 * @param {string} str String to 'humanise'.
 * @returns {string} String, 'humanised.'
 *
 * TODO Check that the handling of common file extensions works
 */
fGrammar.humanize = function (str) {
  if (fGrammar._humanizeCache[str]) {
    return fGrammar._humanizeCache[str];
  }

  var original = str;

  if (str.indexOf(' ') === -1 && str.indexOf('_') !== -1) {
    str = fGrammar.underscorize(str);
  }

  var regex = /(\b(api|css|gif|html|id|jpg|js|mp3|pdf|php|png|sql|swf|url|xhtml|xml)\b|\b\w)/;
  str = str.replace(/_/g, ' ').replace(regex, function (str, p1) {
    return p1.charAt(0).toUpperCase();
  });

  fGrammar._humanizeCache[original] = str;

  return str;
};
/**
 * Converts an <code>underscore_notation</code>, human-friendly or
 *   <code>camelCase</code> string to <code>camelCase</code>.
 * @param {string} str String to convert.
 * @param {boolean} [upper=false] If the camel case should
 *   <code>UpperCamelCase</code>.
 * @param {string} [delimiter] Force a delimiter to be used.
 * @returns {string} The converted string.
 */
fGrammar.camelize = function (str, upper, delimiter) {
  if (upper && fGrammar._camelizeCache.upper[str]) {
    return fGrammar._camelizeCache.upper[str];
  }
  else if (!upper && fGrammar._camelizeCache.lower[str]) {
    return fGrammar._camelizeCache.lower[str];
  }

  delimiter === undefined && (delimiter = '_');
  upper === undefined && (upper = false);

  var original = str;

  if (str.indexOf(' ') !== -1) {
    str = str.replace(/\s+/g, delimiter).toLowerCase();
  }

  if (str.indexOf(delimiter) === -1) {
    if (upper) {
      str = str.charAt(0).toUpperCase() + str.substr(1);
    }
  }
  else {
    var next = str.indexOf(delimiter);
    var beginning;
    var parts = [];
    while (next !== -1) {
      beginning = str.charAt(0).toUpperCase();
      parts.push(beginning + str.substr(1, next - 1));
      str = str.substr(next + 1);
      next = str.indexOf(delimiter);
    }

    // Last part of the string
    parts.push(str.charAt(0).toUpperCase() + str.substr(1));

    str = parts.join('');

    if (!upper) {
      str = str.charAt(0).toLowerCase() + str.substr(1);
    }
  }

  if (upper) {
    fGrammar._camelizeCache.upper[original] = str;
  }
  else {
    fGrammar._camelizeCache.lower[original] = str;
  }

  return str;
};
/**
 * Returns the singular or plural form of the word or based on the quantity
 *   specified.
 * @param {number} number The quantity (integer).
 * @param {string} singular The string to be returned for when <code>number =
 *   1</code>.
 * @param {string} plural The string to be returned for when number != 1; use
 *   %d to place the quantity in the string.
 * @return {string} The singular or plural form of the word or based on the
 *   quantity specified.
 */
fGrammar.inflectOnQuanity = function (number, singular, plural) {
  if (number === 0 || number > 1) {
    return plural.replace('%d', number);
  }
  return singular;
};
