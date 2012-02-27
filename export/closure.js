/**
 * This file should be the last file added to Closure Compiler when compiling.
 *   Static classes should be plain objects. See fGrammar below.
 *
 * To compile from the root directory:
 * cat `find -iname '*.js' | grep -v export | sort | xargs` export/closure.js | closure-compiler --compilation_level ADVANCED_OPTIMIZATIONS --output_wrapper "(function(){%output%})()"
 */

// fCryptography
window['fCryptography'] = {
  'random': fCryptography.random,
  'randomString': fCryptography.randomString
};

// fGrammar
window['fGrammar'] = {
  'underscorize': fGrammar.underscorize,
  'humanize': fGrammar.humanize,
  'camelize': fGrammar.camelize,
  'inflectOnQuanity': fGrammar.inflectOnQuanity
};

// fHTML
// Nothing is in the class yet
// window['fHTML'] = {};

// fJSON
window['fJSON'] = {
  'decode': fJSON.decode,
  'encode': fJSON.encode
};

// fTime
window['fTime'] = fTime; // __construct
window['fTime'].prototype['toString'] = fTime.prototype.toString; // __toString
window['fTime'].prototype['getFuzzyDifference'] = fTime.prototype.getFuzzyDifference;

// fURL
window['fURL'] = {
  'getQueryString': fURL.getQueryString,
  'get': fURL.get,
  'getDomain': fURL.getDomain,
  'redirect': fURL.redirect
};

// fUTF8
window['fUTF8'] = {
  'trim': fUTF8.trim,
  'ltrim': fUTF8.ltrim,
  'pad': fUTF8.pad,
  'pos': fUTF8.pos
};

// fCore
window['fCore'] = {
  'checkOS': fCore.checkOS,
  'debug': fCore.debug,
  'enableDebugging': fCore.enableDebugging,
  'getDebug': fCore.getDebug
};

// fNumber
window['fNumber'] = fNumber; // __construct
window['fNumber'].prototype['trunc'] = fNumber.prototype.trunc;
window['fNumber'].prototype['toString'] = fNumber.prototype.toString; // __toString
window['fNumber'].prototype['toInteger'] = fNumber.prototype.toInteger; // special
window['fNumber'].prototype['toFloat'] = fNumber.prototype.toFloat; // special

// fTimestamp
window['fTimestamp'] = fTimestamp; // not the constructor
window['fTimestamp'].prototype = fTimestamp.prototype;
window['fTimestamp'].prototype.constructor = fTimestamp; // __construct
window['fTimestamp'].prototype['getFuzzyDifference'] = fTimestamp.prototype.getFuzzyDifference;
