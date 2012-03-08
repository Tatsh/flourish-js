/*jshint sub:true */
/**
 * Provides currency function support.
 * Copyrigh (c) 2012 StonerAries.
 * License: http://www.opensource.org/licenses/mit-license.php
 * @constructor
 * @param {string|fNumber} amount The monetary value to represent, should
 *   never be a float since those are imprecise.
 * @param {string} [currency] The currency ISO code for this value.
 * @returns {fMoney} The money object.
 */
var fMoney = function (amount, currency) {
  if (fMoney.defaultCurrency === 'INVALID') {
    fCore.debug('No default currency has been set.');
    return this;
  }

  /**
   * @private
   * @type string|null
   */
  this.currency = (currency !== undefined) ? currency : fMoney.defaultCurrency;

  /**
   * @private
   * @type number
   */
  var precision =  +fMoney.getCurrencyInfo(this.currency, fMoney.CURRENCY_INFO_ELEMENT_PRECISION);

  /**
   * @private
   * @type fNumber
   */
  this.amount = new fNumber(amount, precision);

  return this;
};
/**
 * Key for getting the currency name.
 * @type number
 */
fMoney.CURRENCY_INFO_ELEMENT_NAME = 0;
/**
 * Key for getting the currency symbol.
 * @type number
 */
fMoney.CURRENCY_INFO_ELEMENT_SYMBOL = 1;
/**
 * Key for getting the currency precision.
 * @type number
 */
fMoney.CURRENCY_INFO_ELEMENT_PRECISION = 2;
/**
 * Key for getting the currency value.
 * @type number
 */
fMoney.CURRENCY_INFO_ELEMENT_VALUE = 3;
/**
 * @private
 * @type string
 */
fMoney.defaultCurrency = 'INVALID';
/**
 * @private
 * @type Object
 */
fMoney._currencies = {};
fMoney._currencies['USD'] = {};
fMoney._currencies['USD'][fMoney.CURRENCY_INFO_ELEMENT_NAME] = 'United States Dollar';
fMoney._currencies['USD'][fMoney.CURRENCY_INFO_ELEMENT_SYMBOL] = '$';
fMoney._currencies['USD'][fMoney.CURRENCY_INFO_ELEMENT_PRECISION] = 2;
fMoney._currencies['USD'][fMoney.CURRENCY_INFO_ELEMENT_VALUE] = '1.00000000';
/**
 * Define a new currency for fMoney
 * @param {string} isoCode The ISO code for the currency.
 * @param {string} name The name of the currency
 * @param {string} symbol The symbol associated with the currency
 * @param {number} precision The number of digits after the decimal
 * @param {string} value The value of the currency
 * @see http://en.wikipedia.org/wiki/ISO_4217
 */
fMoney.defineCurrency = function (isoCode, name, symbol, precision, value) {
  fMoney._currencies[isoCode] = {};
  fMoney._currencies[isoCode][fMoney.CURRENCY_INFO_ELEMENT_NAME] = name;
  fMoney._currencies[isoCode][fMoney.CURRENCY_INFO_ELEMENT_SYMBOL] = symbol;
  fMoney._currencies[isoCode][fMoney.CURRENCY_INFO_ELEMENT_PRECISION] = precision;
  fMoney._currencies[isoCode][fMoney.CURRENCY_INFO_ELEMENT_VALUE] = value;
};
/**
 * List all the defined currencies.
 * @param {boolean} [alpha=false] Set to <em>true</em> if you want the
 *   currencies in alphabetical order.
 * @returns {Array} The currency ISO codes. If you set alpha to true they will be
 * alphabetical order if not they will be in a unsorted order
 */
fMoney.getCurrencies = function (alpha) {
  if (alpha === undefined) {
    alpha = false;
  }
  return objectKeys(fMoney._currencies, alpha);
};
/**
 * Retrieve information about a defined currency
 * @param {string} isoCode The iso code of the currency you want to retrieve
 * @param {number} [element] The element of the currency you want to retrieve.
 *   One of the fMoney.CURRENCY_INFO_* consts.
 * @returns {string|Object|number} The information about the retrieved currency.
 */
fMoney.getCurrencyInfo = function (isoCode, element) {
  if (fMoney._currencies[isoCode] === undefined) {
    fCore.debug('The currency specified, %s, is not a valid currency. Returning empty object.', isoCode);
    return {};
  }

  if (element === undefined) {
    return fMoney._currencies[isoCode];
  }

  return fMoney._currencies[isoCode][element];
};
/**
 * Resets the fMoney class back to its default state.
 * @private
 */
fMoney.reset = function () {
  fMoney._currencies = {};
  fMoney._currencies['USD'] = {};
  fMoney._currencies['USD'][fMoney.CURRENCY_INFO_ELEMENT_NAME] = 'United States Dollar';
  fMoney._currencies['USD'][fMoney.CURRENCY_INFO_ELEMENT_SYMBOL] = '$';
  fMoney._currencies['USD'][fMoney.CURRENCY_INFO_ELEMENT_PRECISION] = 2;
  fMoney._currencies['USD'][fMoney.CURRENCY_INFO_ELEMENT_VALUE] = '1.00000000';
  fMoney.defaultCurrency = 'INVALID';
};
/**
 * Set the default currency of fMoney
 * @param {string} isoCode The currency to set as the default
 */
fMoney.setDefaultCurrency = function (isoCode) {
  if (fMoney._currencies[isoCode] === undefined) {
    fCore.debug('The currency ISO code specified, %s, is not a valid ISO code. Not setting.', isoCode);
    return;
  }

  fMoney.defaultCurrency = isoCode;
};
/**
 * List the default currency of fMoney.
 * @returns {string}
 */
fMoney.getDefaultCurrency = function () {
  return fMoney.defaultCurrency;
};
/**
 * toString implementation.
 * @returns {string} The monetary value without the currency symbol or
 *   thousands separator.
 */
fMoney.prototype.toString = function () {
  return this.amount.toString();
};
/**
 * Returns the fNumber object representing the amount.
 * @returns {fNumber} The amount of this monetary value.
 */
fMoney.prototype.getAmount = function () {
  return this.amount;
};
/**
 * Get the current currency of this object.
 * @returns {string} The currency ISO code.
 */
fMoney.prototype.getCurrency = function () {
  return this.currency;
};
// TODO Needs .convert
// /**
//  * Checks if two values are equal
//  * @param {fMoney|string|number} money The money object to compare; a string
//  *   or number will be converted to a default currency.
//  * @returns {boolean} If the values are equal
//  */
// fMoney.prototype.eq = function (money) {
//   money = this.makeMoney(money);
//   return this.amount.eq(money.convert(this.currency).amount);
// };
// /**
//  * Checks if this value is greater then the one passed
//  * @param {fMoney|string|number} money The money object to compare; a string
//  *   or number will be converted to a default currency.
//  * @returns {boolean} If the value is greater then the one passed
//  */
// fMoney.prototype.gt = function (money) {
//   money = this.makeMoney(money);
//   return this.amount.gt(money.convert(this.currency).amount);
// };
// /**
//  * Checks if this value is greater than or equal to the one passed
//  * @param {fMoney|string|number} money The money object to compare; a string
//  *   or number will be converted to a default currency.
//  * @returns {boolean} If the value is greater then the one passed
//  */
// fMoney.prototype.gte = function (money){
//   money = this.makeMoney(money);
//   return this.amount.gte(money.convert(this.currency).amount);
// };
// /**
//  * Checks if this value is less then the one passed
//  * @param {fMoney|string|number} money The money object to compare; a string
//  *   or number will be converted to a default currency.
//  * @returns {boolean} If the value is greater then the one passed
//  */
// fMoney.prototype.lt = function (money){
//   money = this.makeMoney(money);
//   return this.amount.lt(money.convert(this.currency).amount);
// };
// /**
//  * Checks if this value is less than or equal to the one passed
//  * @param {fMoney|string|number} money The money object to compare; a string
//  *   or number will be converted to a default currency.
//  * @returns {boolean} If the value is greater then the one passed
//  */
// fMoney.prototype.lte = function (money){
//   money = this.makeMoney(money);
//   return this.amount.lte(money.convert(this.currency).amount);
// };
/**
 * Turns a string into an fMoney object if a default currency is defined.
 * @private
 * @param {fMoney|string|number} money The value to convert to an fMoney
 *   object.
 * @returns {fMoney|number|string|null} The converted value; null if the value
 *   was invalid or if the default currency is not set for the class.
 */
fMoney.prototype.makeMoney = function (money) {
  // All fMoney objects have a makeMoney property
  if (money.makeMoney) {
    return money;
  }

  // All JS objects except null and undefined have a toString() method
  if (money && money.toString) {
    money = money.toString();
  }

  // Now just make sure it's not empty, or somehow boolean false
  if (!money) {
    fCore.debug('The money value specified is not valid.');
    return null;
  }

  // Class validation
  if (fMoney.defaultCurrency === 'INVALID') {
    fCore.debug('A default currency must be set in order to convert strings or numbers to fMoney objects on the fly.');
    return null;
  }

  return new fMoney(money);
};
/**
 * Formats the amount by preceeding the amount with the currency symbol
 *   and adding thousand seperators.
 * @param {boolean} removeZeroFraction If true and all the digits after the
 *   decimal place are 0's the decimal place and all zeros are removed.
 * @returns {string} The formatted (and possibly converted) value.
 */
fMoney.prototype.format = function (removeZeroFraction) {
  var number = this.toString();
  var parts = number.split('.');

  var integer = parts[0];
  var fraction = (parts[1] === undefined) ? '' : parts[1];

  var sign = '';
  if (integer.charAt(0) === '-'){
    sign = '-';
    integer = integer.substr(1);
  }

  var intSections = [];

  for (var i = integer.length-3; i > 0; i -= 3) {
    intSections.unshift(integer.substr(i, 3));
  }
  intSections.unshift(integer.substr(i, 3));

  var symbol = fMoney.getCurrencyInfo(this.currency, fMoney.CURRENCY_INFO_ELEMENT_SYMBOL);
  integer = intSections.join(',');
  fraction = (fraction.length) ? '.' + fraction : '';

  if (removeZeroFraction && fUTF8.rtrim(fraction, '.0') === '') {
    fraction = '';
  }

  return sign + symbol + integer + fraction;
};
// TODO
// /**
//  * Adds monetary value.
//  * @param {fMoney|string|number} addend The money object to add, string or integer.
//  * @returns {fMoney} The sum of the monary values in this currency.
//  */
// fMoney.prototype.add = function (addend) {
//   addend = this.makeMoney(addend);
// 
//   var convertedAddend = addend.convert(this.currency).amount;
//   var precision = +fMoney.getCurrencyInfo(this.currency, fMoney.CURRENCY_INFO_ELEMENT_PRECISION);
//   var newAmount = this.amount.add(convertedAddend, precision + 1).round(precision);
// 
//   return new fMoney(newAmount, this.currency);
// };
// /**
//  * Splits the current value into multiple parts ensuring that the sum of the
//  *   results is exactly equal to this amount.
//  * @param {fNumber|string|number} ratio1 The ratio of the first amount to this
//  *   amount.
//  * @param {fNumber|string|number} ratio2 The ratio of the second amount to this
//  *   amount.
//  * @returns {Array} Array of fMoney objects with the correct values.
//  */
// fMoney.prototype.allocate = function (ratio1, ratio2) {
//   var total = new fNumber('0', 10);
//   var ratios = arguments;
//   var monies = [], i;
// 
//   if (!total.eq('1.0')) {
//     var ratioValues;
//     for (i = 0, ratioValues = []; i < ratios.length; i++) {
//       ratioValues.push(ratios[i].toString());
//     }
// 
//     fCore.debug('The ratios specified (%s) combined are not equal to 1.', ratioValues.join(', '));
//     return monies;
//   }
// 
//   var precision = +fMoney.getCurrencyInfo(this.currency, fMoney.CURRENCY_INFO_ELEMENT_PRECISION);
//   var smallestAmount;
// 
//   if (precision === 0) {
//     smallestAmount = new fNumber('1');
//   } else {
//     smallestAmount = new fNumber('0' + fUTF8.pad('', precision - 1, '0') + '1');
//   }
// 
//   var smallestMoney = new fMoney(smallestAmount, this.currency);
//   var sum = new fNumber('0', precision);
//   var money, newAmount;
// 
//   for (i = 0, newAmount; i < ratios.length; i++) {
//     newAmount = this.amount.mul(ratios[i]).trunc(precision);
//     sum = sum.add(newAmount, precision + 1).round(precision);
//     monies.push(new fMoney(newAmount, this.currency));
//   }
// 
//   a: while (sum.lt(this.amount)) {
//       for (i = 0; i < monies.length; i++) {
//         if(sum.eq(this.amount)) {
//           break a;
//         }
//         money = this.add(smallestMoney);
//         sum = sum.add(smallestAmount, precision + 1).round(precision);
//       }
//     }
// 
//   return monies;
// };
// /**
//  * Converts this money amount to another currency.
//  * @param {string} newCurrency The ISO code of the currency.
//  * @returns {fMoney} A New fMoney object returning the new amount in a new
//  *   currency.
//  */
// fMoney.prototype.convert = function (newCurrency) {
//   if (newCurrency == this.currency) {
//     return this;
//   }
// 
//   if (fMoney._currencies[newCurrency] === undefined) {
//     fCore.debug('The currency specified, %s, is not a valid currency.');
//     return this;
//   }
// 
//   var currencyValue = fMoney.getCurrencyInfo(this.currency, fMoney.CURRENCY_INFO_ELEMENT_VALUE).toString();
//   var newCurrencyValue = fMoney.getCurrencyInfo(newCurrency, fMoney.CURRENCY_INFO_ELEMENT_VALUE).toString();
//   var newPrecision = +fMoney.getCurrencyInfo(newCurrency, fMoney.CURRENCY_INFO_ELEMENT_PRECISION);
// 
//   var newAmount = this.amount.mul(currencyValue, 8).div(newCurrencyValue, newPrecision + 1).round(newPrecision);
// 
//   return new fMoney(newAmount, newCurrency);
// };
// /**
//  * Mupltiplies the value times the number passed.
//  * @param {fNumber|string|number} multiplicand The number of times to multiply
//  *   the amount.
//  * @returns {fMoney} The product of the value and the multiplicand passed.
//  */
// fMoney.prototype.mul = function (multiplicand) {
//   var precision = fMoney.getCurrencyInfo(this.currency,fMoney.CURRENCY_INFO_ELEMENT_PRECISION);
//   var newAmount = this.amount.mul(multiplicand, +precision+1).round(+precision);
//   return new fMoney(newAmount, this.currency);
// };
// /**
//  * Subtracts the value from our current.
//  * @param {fMoney|string|number} subtrahend The money object to sub, a string
//  *   or number will be converted to a default currency.
//  * @returns {fMoney} The difference of the value in this currency.
//  */
// fMoney.prototype.sub = function (subtrahend) {
//   subtrahend = this.makeMoney(subtrahend);
//   var convertedSubtrahend = subtrahend.convert(this.currency).amount;
//   var precision = +fMoney.getCurrencyInfo(this.currency, fMoney.CURRENCY_INFO_ELEMENT_PRECISION);
//   var newAmount = this.amount.sub(convertedSubtrahend, precision + 1).round(precision);
//   return new fMoney(newAmount, this.currency);
// };
