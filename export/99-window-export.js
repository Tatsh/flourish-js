/*jshint sub:true */
/**
 * This file should be the last file added to Closure Compiler when compiling.
 *   Static classes should be plain objects. See fGrammar below.
 *
 * To compile from the root directory:
 * JSARG=""; for i in $(find -iname '*.js' | grep -v fMoney | sort); do JSARG="$JSARG --js $i"; done && closure-compiler $JSARG --compilation_level ADVANCED_OPTIMIZATIONS --output_wrapper "(function(){%output%}())" --warning_level VERBOSE
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

// fRequest
window['fRequest'] = {
  'get': fRequest.get
};

// fSession
window['fSession'] = {
  'add': fSession.add,
  'clear': fSession.clear,
  'deleteKey': fSession.deleteKey,
  'destroy': fSession.destroy,
  'get': fSession.get,
  'set': fSession.set
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
  'pos': fUTF8.pos,
  'rtrim': fUTF8.rtrim,
  'natcmp': fUTF8.natcmp
};

// fCore
window['fCore'] = {
  'checkOS': fCore.checkOS,
  'debug': fCore.debug,
  'enableDebugging': fCore.enableDebugging,
  'getDebug': fCore.getDebug
};

// fDate
window['fDate'] = fDate;
window['fDate'].prototype['adjust'] = fDate.prototype.adjust;
window['fDate'].prototype['eq'] = fDate.prototype.eq;
window['fDate'].prototype['getFuzzyDifference'] = fDate.prototype.getFuzzyDifference;
window['fDate'].prototype['gt'] = fDate.prototype.gt;
window['fDate'].prototype['gte'] = fDate.prototype.gte;
window['fDate'].prototype['lt'] = fDate.prototype.lt;
window['fDate'].prototype['lte'] = fDate.prototype.lte;
window['fDate'].prototype['toString'] = fDate.prototype.toString;

// fNumber
window['fNumber'] = fNumber; // __construct
window['fNumber']['pi'] = fNumber.pi;
//window['fNumber']['baseConvert'] = fNumber.baseConvert;
window['fNumber'].prototype['abs'] = fNumber.prototype.abs;
window['fNumber'].prototype['eq'] = fNumber.prototype.eq;
window['fNumber'].prototype['gt'] = fNumber.prototype.gt;
window['fNumber'].prototype['gte'] = fNumber.prototype.gte;
window['fNumber'].prototype['lt'] = fNumber.prototype.lt;
window['fNumber'].prototype['lte'] = fNumber.prototype.lte;
window['fNumber'].prototype['add'] = fNumber.prototype.add;
window['fNumber'].prototype['sub'] = fNumber.prototype.sub;
//window['fNumber'].prototype['div'] = fNumber.prototype.div;
//window['fNumber'].prototype['mul'] = fNumber.prototype.mul;
//window['fNumber'].prototype['pow'] = fNumber.prototype.pow;
//window['fNumber'].prototype['round'] = fNumber.prototype.round;
window['fNumber'].prototype['trunc'] = fNumber.prototype.trunc;
window['fNumber'].prototype['toString'] = fNumber.prototype.toString; // __toString
window['fNumber'].prototype['toInteger'] = fNumber.prototype.toInteger; // special
window['fNumber'].prototype['toFloat'] = fNumber.prototype.toFloat; // special

// fTimestamp
window['fTimestamp'] = fTimestamp;
window['fTimestamp'].prototype = fTimestamp.prototype;
window['fTimestamp'].prototype['getFuzzyDifference'] = fTimestamp.prototype.getFuzzyDifference;
