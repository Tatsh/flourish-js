/*jshint expr:true */
/**
 * Provides large/precise number support.
 * @param {string|Object|number} value The number to use.
 * @param {number|null} scale The scale to use.
 * @constructor
 * @returns {fNumber} The number object.
 */
var fNumber = function (value, scale) {
  scale === undefined && (scale = null);

  if (typeof value !== 'string') {
    value = String(value);
  }

  value = fNumber.parse(value, 'array');

  if (scale !== null) {
    if (value['fraction'].length > scale) {
      value['fraction'] = value['fraction'].substr(0, scale);
    }
    else {
      value['fraction'] = fUTF8.pad(value['fraction'], scale, '0', 'right');
    }
  }

  /**
   * @private
   * @type string
   */
  this._value = value['fraction'] ? value['integer'] + '.' + value['fraction'] : value['integer'];
  /**
   * @private
   * @type number
   */
  this._scale = value['fraction'].length;

  return this;
};
/**
 * Strips the leading zeroes off a number.
 * @private
 * @param {number|string} number The number to strip.
 * @returns {string} The number with leading zeroes stripped.
 */
fNumber.stripLeadingZeroes = function (number) {
  number = String(number);
  var firstChar = number.charAt(0);
  var sign = '';

  if (!(parseInt(firstChar, 10) || firstChar === '.')) {
    sign = firstChar;
    number = number.substr(1);
  }

  number = fUTF8.ltrim(number);
  if (number.length === 0 || number.charAt(0) === '.') {
    number = '0' + number;
  }

  return sign + number;
};
/**
 * Checks to see if a number is equal to zero.
 * @param {string} number The number to check, first character should be the sign.
 * @returns {boolean} If the number is equal to zero.
 * @private
 */
fNumber.isZero = function (number) {
  number = number.replace(/\./g, '').substr(1);
  return fUTF8.trim(number, '0') === '';
};
/**
 * Parses a number to ensure it is valid. Sets to 0 if invalid.
 * @private
 * @param {Object|string} number The number to parse.
 * @param {string} element The element to return. One of: 'number', 'integer',
 *   'fraction', 'array'. 'array' technically returns a JavaScript object.
 * @returns {string|Object} The requested parsed element.
 */
fNumber.parse = function (number, element) {
  if (typeof number === 'object' && number.toString) {
    number = number.toString();
  }
  else {
    number = String(number);
  }
  number = fUTF8.trim(number);

  // has a D modifier in the original, but that's not needed here
  var matches = number.match(/^([+\-]?)((?:\d*\.)?\d+)(?:e([+\-]?)(\d+))?$/i);
  if (!matches) {
    // NOTE Normally throws an fValidationException here
    number = '0';
    matches = [number, '+'];
  }

  var sign = (matches[1] === '-') ? '-' : '+';
  number = fNumber.stripLeadingZeroes(matches[2]);

  var exponent = matches[4] ? matches[4] : null;
  var exponentSign = matches[3] ? matches[3] : null;
  var fraction, integer, decimalPosition, parts, output = {};

  if (exponent) {
    if (exponentSign === '-') {
      decimalPosition = fUTF8.pos(number, '.');

      if (decimalPosition === false) {
        fraction = '';
        integer = number;
      }
      else {
        var fracSub = fUTF8.pos(number, '.');
        var integerSub = parseInt(fUTF8.pos(number, '.'), 10);
        if (!fracSub) {
          fracSub = 0;
        }
        if (isNaN(integerSub)) {
          integer = 0;
        }

        fraction = number.substr(fracSub + 1);
        integer = number.substr(0, integerSub);
      }
    }
    else {
      number += fUTF8.pad('', exponent, '0', 'right');
    }
  }

  number = fNumber.stripLeadingZeroes(number);

  if (fNumber.isZero(sign + number)) {
    sign = '+';
  }

  parts = (sign + number).split('.');

  output['integer'] = parts[0];
  output['fraction'] = parts[1] ? parts[1] : '';

  if (element === 'integer') {
    return output['integer'];
  }
  else if (element === 'fraction') {
    return output['fraction'];
  }
  else if (element === 'array') { // yes technically it's an Object
    return output;
  }

  return parts.join('.');
};
/**
 * Scales (truncates or expands) the number to the specified number of digits
 *   after the decimal - negative scales round the number by places to the
 *   left of the decimal.
 * @param {number|string} scale The number of places after (or before if negative) the decimal.
 * @returns {fNumber} A new fNumber object.
 */
fNumber.prototype.trunc = function (scale) {
  scale = parseInt(scale, 10);
  var number = this._value;

  if (scale < 0) {
    var end = parseInt(fUTF8.pos(number, '.'), 10);
    if (isNaN(end)) {
      end = 0;
    }
    number = number.substr(0, end);

    if (Math.abs(scale) >= number.length) {
      number = '0';
    }
    else {
      number = number.substr(0, scale);
      number += fUTF8.pad('', Math.abs(scale), '0');
    }
  }

  return new fNumber(number, scale);
};
/**
 * Implements toString().
 * @returns {string} The number as a string.
 */
fNumber.prototype.toString = function () {
  if (this._value.charAt(0) === '+') {
    return String(this._value).substr(1);
  }

  return String(this._value);
};
/**
 * Get the value as an integer.
 * @returns {number} The value as an integer.
 */
fNumber.prototype.toInteger = function () {
  return parseInt(this._value, 10);
};
/**
 * Get the value as a floating point number.
 * @param {number|null} [scale=null] The scale to truncate the number with. Does
 *   not perform rounding.
 * @returns {number} The value as a floating point number.
 * @see fNumber#trunc
 */
fNumber.prototype.toFloat = function (scale) {
  scale === undefined && (scale = null);

  if (scale) {
    scale = parseInt(scale, 10);
    if (isNaN(scale)) {
      scale = 0;
    }
    return this.trunc(scale).toFloat();
  }

  return parseFloat(this._value);
};
