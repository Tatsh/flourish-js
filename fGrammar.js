/**
 * Provides notation conversion support.
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
 * Rules for singular to plural inflection of nouns.
 * @type Array
 * @private
 */
fGrammar._singularToPluralRules = [
  ['([ml])ouse$', 'ice'],
  ['(media|info(rmation)?|news)$', ''],
  ['(phot|log|vide)o$', 'os'],
  ['^(q)uiz$', 'uizzes'],
  ['(c)hild$', 'hildren'],
  ['(p)erson$', 'eople'],
  ['(m)an$', 'en'],
  ['([ieu]s|[ieuo]x)$', 'es'],
  ['([cs]h)$', 'es'],
  ['(ss)$', 'es'],
  ['([aeo]l)f$', 'ves'],
  ['([^d]ea)f$', 'ves'],
  ['(ar)f$', 'ves'],
  ['([nlw]i)fe$', 'ves'],
  ['([aeiou]y)$', 's'],
  ['([^aeiou])y$', 'ies'],
  ['([^o])o$', 'oes'],
  ['s$', 'ses'],
  ['(.)$', 's']
];
/**
 * This method is marked private, but it is intended to be used by extensions
 *   such as sGrammar.
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
 * @param {string} str String to underscorise.
 * @returns {string} String, underscorised.
 */
fGrammar.underscorize = function (str) {
  return fGrammar._commonize(str, '_', fGrammar._underscorizeCache);
};
/**
 * Makes an <code>underscore_notation</code>, <code>camelCase</code>, or
 *   human-friendly string into a human-friendly string.
 * @param {string} str String to 'humanise'.
 * @returns {string} String, 'humanised.'
 */
fGrammar.humanize = function (str) {
  if (fGrammar._humanizeCache[str]) {
    return fGrammar._humanizeCache[str];
  }

  var original = str;

  if (str.indexOf(' ') === -1) {
    if (str.indexOf('_') === -1) {
      str = fGrammar.underscorize(str);
    }

    str = str.replace(/_/g, ' ');

    // Upper case every word
    var split = str.split(' ');
    for (var i = 0; i < split.length; i++) {
      split[i] = split[i].charAt(0).toUpperCase() + split[i].substr(1);
    }
    str = split.join(' ');

    var regex = /(\b(api|css|gif|html|id|jpg|js|mp3|pdf|php|png|sql|swf|url|xhtml|xml)\b)/gi;
    str = str.replace(regex, function (m0) {
      return m0.toUpperCase();
    });

    // Finally, to satisfy "somefile.doc" -> Somefile.Doc
    str = str.replace(/\.(\w+)$/, function (m0, m1) {
      return '.' + m1.charAt(0).toUpperCase() + m1.substr(1);
    });
  }

  fGrammar._humanizeCache[original] = str;

  return str;
};
/**
 * Converts an <code>underscore_notation</code>, human-friendly or
 *   <code>camelCase</code> string to <code>camelCase</code>.
 * @param {string} str String to convert.
 * @param {boolean} [upper=false] If the camel case should be
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

  if (upper === undefined) {
    upper = false;
  }
  if (delimiter === undefined) {
    delimiter = '_';
  }

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
 * @param {number} number The quantity.
 * @param {string} singular The string to be returned for when <code>number =
 *   1</code>.
 * @param {string} plural The string to be returned for when
 *   <code>number != 1</code>; use <code>%d</code> to place the quantity in the
 *   string.
 * @return {string} The singular or plural form of the word or based on the
 *   quantity specified.
 */
fGrammar.inflectOnQuantity = function (number, singular, plural) {
  if (number !== 1) {
    return plural.replace('%d', number.toString());
  }
  return singular;
};
/**
 * Cache of pluralisations.
 * @type Object
 * @private
 */
fGrammar._pluralizeCache = {};
/**
 * Splits the last word from a <code>camelCase</code> or
 *   <code>underscore_notation</code> string.
 * @param {string} str String the split the word from.
 * @return {Array} The first element is the beginning of the string. The second
 *   is the last word.
 * @private
 */
fGrammar._splitLastWord = function (str) {
  if (str.indexOf(' ') !== -1) {
    return [
      str.substr(0, str.lastIndexOf(' ') + 1),
      str.substr(str.lastIndexOf(' ') + 1)
    ];
  }

  // Handle underscore notation
  if (str === fGrammar.underscorize(str)) {
    if (str.substr(' ') === -1) {
      return ['', str];
    }
    return [
      str.substr(0, str.lastIndexOf('_') + 1),
      str.substr(str.lastIndexOf('_') + 1)
    ];
  }

  // Handle camelCase
  var matches = str.match(/(.*)((?=[a-zA-Z_]|^)(?:[0-9]+|[A-Z][a-z]*)|(?=[0-9A-Z_]|^)(?:[A-Z][a-z]*))$/);
  if (matches.length && matches.length === 3) {
    return [matches[1], matches[2]];
  }

  return ['', str];
};
/**
 * Convert noun to plural form.
 * @param {string} noun The noun to pluralise.
 * @returns {string} The noun in plural form, or <code>null</code>.
 */
fGrammar.pluralize = function (noun) {
  if (fGrammar._pluralizeCache[noun] !== undefined) {
    return fGrammar._pluralizeCache[noun];
  }

  var original = noun;
  var plural = null;
  var beginning, singular;
  var matches = fGrammar._splitLastWord(noun);
  var to, regex, found;
  
  beginning = matches[0];
  singular = matches[1];

  for (var i = 0; i < fGrammar._singularToPluralRules.length; i++) {    
    from = fGrammar._singularToPluralRules[i][0];
    to = fGrammar._singularToPluralRules[i][1];
    regex = new RegExp(from, 'i');
    
    if (regex.test(singular)) {
      found = singular.match(regex);
      plural = beginning + singular.replace(regex, (found[1] ? '$1' : '') + to);
      break;
    }
  }

  fGrammar._pluralizeCache[original] = plural;

  return plural;
};
