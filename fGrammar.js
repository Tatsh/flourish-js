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
 * Special rules.
 * @type Object
 * @private
 */
fGrammar._rules = {
  humanize: {},
  camelize: {},
  singularize: {},
  pluralize: {},
  underscorize: {}
};
/**
 * Cache of pluralisations.
 * @type Object
 * @private
 */
fGrammar._pluralizeCache = {};
/**
 * Cache of singularlisations.
 * @type Object
 * @private
 */
fGrammar._singularizeCache = {};
/**
 * Rules for singular to plural inflection of nouns.
 * @type Array
 * @private
 */
fGrammar._singularToPluralRules = [
  [/([ml])ouse$/i, 'ice'],
  [/(media|info(rmation)?|news)$/i, ''],
  [/(phot|log|vide)o$/i, 'os'],
  [/^(q)uiz$/i, 'uizzes'],
  [/(c)hild$/i, 'hildren'],
  [/(p)erson$/i, 'eople'],
  [/(m)an$/i, 'en'],
  [/([ieu]s|[ieuo]x)$/i, 'es'],
  [/([cs]h)$/i, 'es'],
  [/(ss)$/i, 'es'],
  [/([aeo]l)f$/i, 'ves'],
  [/([^d]ea)f$/i, 'ves'],
  [/(ar)f$/i, 'ves'],
  [/([nlw]i)fe$/i, 'ves'],
  [/([aeiou]y)$/i, 's'],
  [/([^aeiou])y$/i, 'ies'],
  [/([^o])o$/i, 'oes'],
  [/s$/i, 'ses'],
  [/(.)$/i, 's']
];
/**
 * Rules for plural to singular inflection of nouns.
 * @type Array
 * @private
 */
fGrammar._pluralToSingularRules = [
  [/([ml])ice$/i, 'ouse'],
  [/(media|info(rmation)?|news)$/i, ''],
  [/(q)uizzes$/i, 'uiz'],
  [/(c)hildren$/i, 'ild'],
  [/(p)eople$/i, 'erson'],
  [/(m)en$/i, 'an'],
  [/((?!sh).)oes$/i, 'o'],
  [/((?!o)[ieu]s|[ieuo]x)es$/i, ''],
  [/([cs]h)es$/i, ''],
  [/(ss)es$/i, ''],
  [/([aeo]l)ves$/i, 'f'],
  [/([^d]ea)ves$/i, 'f'],
  [/(ar)ves$/i, 'f'],
  [/([nlw]i)ves$/i, 'fe'],
  [/([aeiou]y)s$/i, ''],
  [/([^aeiou])ies$/i, 'y'],
  [/(la)ses$/i, 's'],
  [/(.)s$/i, '']
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
  if (fGrammar._rules.underscorize[str] !== undefined) {
    return fGrammar._rules.underscorize[str];
  }

  return fGrammar._commonize(str, '_', fGrammar._underscorizeCache);
};
/**
 * Makes an <code>underscore_notation</code>, <code>camelCase</code>, or
 *   human-friendly string into a human-friendly string.
 * @param {string} str String to 'humanise'.
 * @returns {string} String, 'humanised.'
 */
fGrammar.humanize = function (str) {
  if (fGrammar._rules.humanize[str] !== undefined) {
    return fGrammar._rules.humanize[str];
  }
  
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
  if (fGrammar._rules.camelize[str] !== undefined) {
    return fGrammar._rules.camelize[str];
  }
  
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
    if (str.indexOf(' ') === -1) {
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
 * Converts noun to plural form.
 * @param {string} noun The noun to pluralise.
 * @returns {string} The noun in plural form, or <code>null</code>.
 */
fGrammar.pluralize = function (noun) {
  if (fGrammar._rules.pluralize[noun] !== undefined) {
    return fGrammar._rules.pluralize[noun];
  }
  
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
    regex = fGrammar._singularToPluralRules[i][0];
    to = fGrammar._singularToPluralRules[i][1];
    
    if (regex.test(singular)) {
      found = singular.match(regex);
      plural = beginning + singular.replace(regex, (found[1] ? '$1' : '') + to);
      break;
    }
  }

  fGrammar._pluralizeCache[original] = plural;

  return plural;
};
/**
 * Converts plural noun to singular form.
 * @param {string} noun The noun to singularise.
 * @returns {string} The noun in singular form, or <code>null</code>.
 */
fGrammar.singularize = function (noun) {
  if (fGrammar._rules.singularize[noun] !== undefined) {
    return fGrammar._rules.singularize[noun];
  }
  
  if (fGrammar._singularizeCache[noun] !== undefined) {
    return fGrammar._singularizeCache[noun];
  }

  var original = noun;
  var singular = null;
  var beginning, plural, matches;
  var to, regex, found;

  matches = fGrammar._splitLastWord(noun);
  beginning = matches[0];
  plural = matches[1];

  for (var i = 0; i < fGrammar._pluralToSingularRules.length; i++) {
    regex = fGrammar._pluralToSingularRules[i][0];
    to = fGrammar._pluralToSingularRules[i][1];

    if (regex.test(plural)) {
      found = plural.match(regex);
      singular = beginning + plural.replace(regex, (found[1] ? '$1': '') + to);
      break;
    }
  }

  fGrammar._singularizeCache[original] = singular;

  return singular;
};
/**
 * Add a rule for <code>singularize()</code> and <code>pluralize()</code>.
 * @param {string} singular Singular version of the noun.
 * @param {string} plural Plural version of the noun.
 */
fGrammar.addSingularPluralRule = function (singular, plural) {
  fGrammar._rules.singularize[plural] = singular;
  fGrammar._rules.pluralize[singular] = plural;
};
/**
 * Add a rule for <code>humanize()</code>.
 * @param {string} original Original string.
 * @param {string} to The string to return.
 */
fGrammar.addHumanizeRule = function (original, to) {
  fGrammar._rules.humanize[original] = to;
};
/**
 * Add a rule for <code>camelize()</code> and <code>underscorize()</code>.
 * @param {string} camelCase Original <code>camelCase</code> string.
 * @param {string} underscore The string to return.
 */
fGrammar.addCamelUnderscoreRule = function (camelCase, underscore) {
  fGrammar._rules.camelize[underscore] = camelCase;
  fGrammar._rules.underscorize[camelCase] = underscore;
};
