/*jshint sub:true */
/**
 * This file should be the last file added to Closure Compiler when compiling.
 *   Static classes should be plain objects. See fGrammar below.
 *
 * To compile from the root directory:
 * JSARG=""; for i in $(find -iname '*.js' | sort); do JSARG="$JSARG --js $i"; done && closure-compiler $JSARG --js export/99-window-export.js --compilation_level ADVANCED_OPTIMIZATIONS --output_wrapper "(function(){%output%}())" --warning_level VERBOSE
 */

// fCryptography
window['fCryptography'] = {
  'random': fCryptography.random,
  'randomString': fCryptography.randomString
};

// fDatabase
window['fDatabase'] = fDatabase;
window['fDatabase'].prototype['setDatabase'] = fDatabase.prototype.setDatabase;
window['fDatabase'].prototype['setConnection'] = fDatabase.prototype.setConnection;
window['fDatabase'].prototype['isConnected'] = fDatabase.prototype.isConnected;
window['fDatabase'].prototype['getVersion'] = fDatabase.prototype.getVersion;
window['fDatabase'].prototype['getConnection'] = fDatabase.prototype.getConnection;
window['fDatabase'].prototype['getErrorHandler'] = fDatabase.prototype.getErrorHandler;
window['fDatabase'].prototype['getName'] = fDatabase.prototype.getName;
window['fDatabase'].prototype['connect'] = fDatabase.prototype.connect;

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
window['fTimestamp'].prototype['getFuzzyDifference'] = fTimestamp.prototype.getFuzzyDifference;

// fMoney
window['fMoney'] = fMoney;
window['fMoney']['CURRENCY_INFO_ELEMENT_NAME'] = fMoney.CURRENCY_INFO_ELEMENT_NAME;
window['fMoney']['CURRENCY_INFO_ELEMENT_PRECISION'] = fMoney.CURRENCY_INFO_ELEMENT_PRECISION;
window['fMoney']['CURRENCY_INFO_ELEMENT_SYMBOL'] = fMoney.CURRENCY_INFO_ELEMENT_SYMBOL;
window['fMoney']['CURRENCY_INFO_ELEMENT_VALUE'] = fMoney.CURRENCY_INFO_ELEMENT_VALUE;
window['fMoney']['defineCurrency'] = fMoney.defineCurrency;
window['fMoney']['getCurrencies'] = fMoney.getCurrencies;
window['fMoney']['getCurrencyInfo'] = fMoney.getCurrencyInfo;
window['fMoney']['reset'] = fMoney.reset;
window['fMoney']['setDefaultCurrency'] = fMoney.setDefaultCurrency;
window['fMoney']['getDefaultCurrency'] = fMoney.getDefaultCurrency;
window['fMoney'].prototype['format'] = fMoney.prototype.format;
window['fMoney'].prototype['getAmount'] = fMoney.prototype.getAmount;
window['fMoney'].prototype['getCurrency'] = fMoney.prototype.getCurrency;
window['fMoney'].prototype['makeMoney'] = fMoney.prototype.makeMoney;
window['fMoney'].prototype['toString'] = fMoney.prototype.toString;