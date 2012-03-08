/*jshint expr:true */
/**
 * Provides large/precise number support.<br><br>
 *
 * TODO<br>
 * Known issues:<br>
 * <ul>
 * <li>baseConvert does not work yet because it relies on .pow</li>
 * <li>.sub does not work when subracting the same number</li>
 * <li>.div causes 'Maximum call stack size exceeded'</li>
 * <li>.mul gives the incorrect result</li>
 * <li>.pow gives an incorrect result (relies on .mul working)</li>
 * </ul>
 *
 * @param {string|Object|number} value The number to use.
 * @param {number} [scale] The scale to use.
 * @constructor
 * @returns {fNumber} The number object.
 */
var fNumber = function (value, scale) {
  if (scale === undefined) {
    scale = 0;
  }

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
 * @param {number} [scale]
 * @returns {number}
 * @private
 */
fNumber._fixScale = function (scale) {
  if (scale !== undefined) {
    scale = +scale;
    if (isNaN(scale) || scale < 0) {
      scale = 0;
    }
  }
  else {
    scale = 0;
  }
  return scale;
};
/**
 * @param {string} number
 * @returns {string}
 */
fNumber._fixSign = function (number) {
  number = number.toString();
  if (number.charAt(0).match(/[0-9]/)) {
    number = '+' + number;
  }
  return number;
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
  if (typeof number === 'object') {
    number = number.toString();
  }
  else {
    number = String(number);
  }
  number = fUTF8.trim(number);

  // has a D modifier in the original, but that should not be needed here
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

  if (element === 'integer' || element === 'number') {
    return output['integer'];
  }
  else if (element === 'fraction') {
    return output['fraction'];
  }
  else if (element === 'array') { // yes technically it's an Object
    return output;
  }

  // Falls through for element 'number'
  return parts.join('.');
};
// TODO Fix
// /**
//  * Converts any positive integer between any two bases ranging from 2 to 16.
//  * @param {fNumber|string|number} number The positive integer to convert.
//  * @param {number} fromBase The base to convert from; must be between 2 and 16.
//  * @param {number} toBase The base to convert to; must be between 2 and 16.
//  * @returns {string} The number converted to the new base. If an error occurs,
//  *   the original number will be returned.
//  */
// fNumber.baseConvert = function (number, fromBase, toBase) {
//   if (typeof number === 'object' && fromBase != 10) {
//     fCore.debug('The from base specified, %d, is not valid for an fNumber object.', fromBase);
//     return String(number);
//   }
//   else {
//     number = String(number);
//   }
//
//   if (number.length && number.charAt(0) === '+') {
//     number = number.substr(1);
//   }
//
//   if (!number.match(/^[A-Fa-f\d]+$/g)) {
//     fCore.debug('The number specified does not appear to be a positive integer.');
//     return number;
//   }
//
//   if (isNaN(parseInt(number, fromBase)) || fromBase < 2 || fromBase > 16) {
//     fCore.debug('The from base specified, %d, is not between 2 and 16.', fromBase);
//     return number;
//   }
//
//   if (isNaN(parseInt(number, fromBase)) || toBase < 2 || toBase > 16) {
//     fCore.debug('The to base specified, %d, is not between 2 and 16.', fromBase);
//     return number;
//   }
//
//   var baseString = '0123456789ABCDEF';
//   var baseMap = {
//     'A': 10,
//     'B': 11,
//     'C': 12,
//     'D': 13,
//     'E': 14,
//     'F': 15
//   };
//   var decimal, output = '';
//
//   // Convert input number to base 10
//   if (fromBase !== 10) {
//     var baseNum = new fNumber(fromBase);
//     var charS, value;
//
//     decimal = new fNumber('0');
//
//     for (var i = 0; i < number.length; i++) {
//       charS = number.charAt(i).toUpperCase();
//       value = new fNumber(baseMap[charS] !== undefined ? baseMap[charS] : charS);
//       decimal = decimal.add(value.mul(baseNum.pow(number.length-(i+1))).round(0));
//     }
//   }
//   else if (typeof number !== 'object') {
//     decimal = new fNumber(number);
//   }
//   else {
//     decimal = number;
//   }
//
//   if (toBase != 10) {
//     var frac, x;
//
//     do {
//       frac = decimal.div(toBase, 3).toString();
//       frac = '0' + frac.substr(frac.indexOf('.'));
//       x = +(frac * toBase + 1.5);
//
//       output = baseString[x-1] + output;
//
//       decimal = decimal.div(toBase, 0);
//     } while (decimal.gt('0.0'));
//   }
//   else {
//     output = decimal.toString();
//   }
//
//   return output;
// };
/**
 * Pi decimal points. Would like to have this calculated instead if possible
 *   so it can be packed better by the compiler.
 * @private
 * @type string
 */
fNumber._piPlaces = '14159265358979323846264338327950288419716939937510582097494459230781640628620899862803482534211706798214808651328230664709384460955058223172535940812848111745028410270193852110555964462294895493038196442881097566593344612847564823378678316527120190914564856692346034861045432664821339360726024914127372458700660631558817488152092096282925409171536436789259036001133053054882046652138414695194151160943305727036575959195309218611738193261179310511854807446237996274956735188575272489122793818301194912';
/**
 * Returns the value for pi with a scale up to 500.
 * @param {number} scale The number of places after the decimal to return.
 * @returns {fNumber} Pi value in fNumber object.
 */
fNumber.pi = function (scale) {
  scale = +scale;
  if (isNaN(scale) || scale < 0 || scale > 500) {
    fCore.debug('Scale specified is invalid. Using scale of 2.');
    scale = 2;
  }

  var fraction = fNumber._piPlaces.substr(0, scale);
  fraction = fraction.length ? '.' + fraction : '';

  return new fNumber('3' + fraction, scale);
};
/**
 * Returns the absolute value of this number.
 * @param {number} scale The number of places after the decimal.
 * @returns {fNumber} The absolute number.
 */
fNumber.prototype.abs = function (scale) {
  scale = fNumber._fixScale(scale);
  return new fNumber(this._value.substr(1), scale);
};
/**
 * Normalises two numbers to the same number of decimal places.
 * @param {fNumber|string|number} number1 The first number to normalise.
 * @param {fNumber|string|number} number2 The second number to normalise.
 * @param {number} [scale] The number of digits after the decimal.
 * @returns {Array} The two normalised numbers as string.
 */
fNumber._normalize = function (number1, number2, scale) {
  var objNumber1 = fNumber.parse(number1.toString(), 'array');
  var objNumber2 = fNumber.parse(number2.toString(), 'array');

  if (scale !== undefined || objNumber1['fraction'] || objNumber2['fraction']) {
    var fracLen = scale !== undefined ? scale : 0;

    if (scale === undefined) {
      fracLen = Math.max(objNumber1['fraction'].length, objNumber2['fraction'].length);
    }

    if (scale !== undefined && objNumber1['fraction'].length > scale) {
      objNumber1['fraction'] = objNumber1['fraction'].substr(0, scale);
    }
    else {
      objNumber1['fraction'] = fUTF8.pad(objNumber1['fraction'], fracLen, '0', 'right');
    }
    if (scale !== undefined && objNumber2['fraction'].length > scale) {
      objNumber2['fraction'] = objNumber2['fraction'].substr(0, scale);
    }
    else {
      objNumber2['fraction'] = fUTF8.pad(objNumber2['fraction'], fracLen, '0', 'right');
    }

    /**
     * @param {Object|string} obj
     * @param {string} sep
     * @returns {string}
     * @private
     */
    var joinObject = function (obj, sep) {
      var ret = '';
      var count = (function () {
        var count = 0;
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            count++;
          }
        }
        return count;
      })();

      var i = 0;
      for (var key in obj) {
        if (obj.hasOwnProperty(key) && i !== (count-1)) {
          ret += obj[key] + sep;
          i++;
        }
      }
      return ret;
    };

    // This is to get rid of this warning: actual parameter 1 of joinObject does not match formal parameter
    var populate = function (obj) {
      var ret = {};
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          ret[key] = obj[key];
        }
      }
      return key;
    };
    var obj1 = populate(objNumber1), obj2 = populate(objNumber2);
    number1 = joinObject(obj1, '.');
    number2 = joinObject(obj2, '.');
  }
  else {
    number1 = objNumber1['integer'];
    number2 = objNumber2['integer'];
  }

  var len = Math.max(number1.length - 1, number2.length - 1);

  number1 = number1.charAt(0) + fUTF8.pad(number1.substr(1), len, '0', 'left');
  number2 = number2.charAt(0) + fUTF8.pad(number2.substr(1), len, '0', 'left');

  return [number1, number2];
};
/**
 * Sets the scale for a number.
 * @param {string} number The number to set the scale for.
 * @param {number} scale The number of digits to have after the decimal.
 * @returns {string} The scaled number.
 * @private
 */
fNumber._setScale = function (number, scale) {
  if (scale === undefined) {
    return number;
  }

  var parts = number.split('.');
  var integer = parts[0];
  var fraction = parts[1] ? parts[1] : '';

  if (fraction.length > scale) {
    fraction = fraction.substr(0, scale);
  }
  else {
    fraction = fUTF8.pad(fraction, scale, '0', 'right');
  }

  fraction = fraction.length ? '.' + fraction : '';

  return integer + fraction;
};
/**
 * Compares two numbers.
 * @param {string} number1
 * @param {string} number2
 * @returns {number} Less than 0 if <code>number1</code> is less than
 *   <code>number2</code>, 0 if equal, greater than 0 if <code>number1</code>
 *   is greater than <code>number2</code>
 * @private
 */
fNumber._cmp = function (number1, number2) {
  number1 = fNumber._fixSign(number1);
  number2 = fNumber._fixSign(number2);

  if (number1.charAt(0) !== number2.charAt(0)) {
    return number1.charAt(0) === '+' ? 1 : -1;
  }

  if (number1.charAt(0) === '-') {
    return fUTF8.natcmp(number2.substr(1), number1.substr(1));
  }

  return fUTF8.natcmp(number1.substr(1), number2.substr(1));
};
/**
 * Subtracts numbers.
 * @param {string} minuend The number to subract from.
 * @param {string} subtrahend The number to subtract.
 * @param {number} [scale] The number of digits after the decimal.
 * @returns {string} The difference.
 * @private
 */
fNumber._performSub = function (minuend, subtrahend, scale) {
  var array = fNumber._normalize(minuend, subtrahend), diff;
  minuend = array[0];
  subtrahend = array[1];
  scale = fNumber._fixScale(scale);

  if (subtrahend.charAt(0) === '-') {
    if (minuend.charAt(0) === '-') {
      return fNumber._performSub('+' + subtrahend.substr(1), '+' + minuend.substr(1), scale);
    }

    return fNumber._performAdd('+' + subtrahend.substr(1), '+' + minuend.substr(1), scale);
  }

  if (minuend.charAt(0) === '-') {
    var sum = fNumber._performAdd('+' + minuend.substr(1), subtrahend, scale);
    return '-' + sum.substr(1);
  }

  if (fNumber._cmp(minuend, subtrahend) < 0) {
    diff = fNumber._performSub('+' + subtrahend.substr(1), '+' + minuend.substr(1), scale);
    diff = diff.substr(1);
    return minuend.charAt(0) === '+' ? '-' + diff : '+' + diff;
  }

  var borrow = 0;
  var output = '';

  for (var i = minuend.length - 1; i > 0; i--) {
    if (minuend.charAt(i) === '.') {
      output = '.' + output;
      continue;
    }

    diff = (+minuend.charAt(i)) - (+subtrahend.charAt(i)) - borrow;
    borrow = 0;
    while (diff < 0) {
      borrow++;
      diff += 10;
    }
    output = diff + output;
  }

  output = fNumber._setScale(minuend.charAt(0) + output, scale);

  return fNumber.stripLeadingZeroes(output);
};
/**
 * Adds two numbers together.
 * @param {string} number1 The first addend.
 * @param {string} number2 The second addend.
 * @param {number} [scale] The number of digits after the decimal.
 * @returns {string} The sum of the two numbers.
 * @private
 */
fNumber._performAdd = function (number1, number2, scale) {
  if (scale === undefined) {
    scale = 0;
  }

  var array = fNumber._normalize(number1, number2);
  number1 = array[0];
  number2 = array[1];

  if (fNumber.isZero(number1)) {
    return fNumber._setScale(number2, scale);
  }
  else if (fNumber.isZero(number2)) {
    return fNumber._setScale(number1, scale);
  }

  if (number1.charAt(0) !== number2.charAt(0)) {
    if (number1.charAt(0) === '-') {
      return fNumber._performSub(number2, '+' + number1.substr(1));
    }
    return fNumber._performSub(number2, '+' + number2.substr(1));
  }

  var carry = 0;
  var output = '';
  var sum;

  for (var i = number1.length - 1; i > 0; i--) {
    if (number1.charAt(i) === '.') {
      output = '.' + output;
      continue;
    }

    sum = String((+number1.charAt(i)) + (+number2.charAt(i)) + carry);
    carry = sum.length > 1 ? sum.substr(0, -1) : 0;
    output = sum.substr(-1) + output;
  }

  if (carry) {
    output = carry + output;
  }

  output = fNumber._setScale(number1.charAt(0) + output, scale);

  return fNumber.stripLeadingZeroes(output);
};
/**
 * Adds two numbers together.
 * @param {fNumber|number|string} addend The addend
 * @param {number} [scale] The number of places after the decimal.
 * @returns {fNumber} The sum.
 */
fNumber.prototype.add = function (addend, scale) {
  scale = fNumber._fixScale(scale);
  addend = fNumber.parse(addend.toString(), 'number').toString();

  // Not using bcadd
  var sum = fNumber._performAdd(this._value, addend, scale);

  return new fNumber(sum, scale);
};
/**
 * @private
 * @param {string} str
 * @returns {Array}
 */
fNumber._toArray = function (str) {
  var ret = [];
  for (var i = 0; i < str.length; i++) {
    ret.push(str[i]);
  }
  return ret;
};
// TODO Fix
// /**
//  * Multiplies two numbers.
//  * @param {string} multiplicand
//  * @param {string} multiplier
//  * @param {number} [scale] Currently not used.
//  * @returns {string} The product.
//  * @private
//  */
// fNumber._performMul = function (multiplicand, multiplier, scale) {
//   if (scale === undefined) {
//     scale = 0;
//   }
//
//   multiplicand = fNumber._fixSign(multiplicand);
//   multiplier = fNumber._fixSign(multiplier);
//
//   if (fNumber.isZero(multiplicand) || fNumber.isZero(multiplier)) {
//     return fNumber._setScale('+0', scale);
//   }
//
//   var afterDecimal = 0;
//
//   if (fUTF8.pos(multiplicand, '.') !== false) {
//     afterDecimal += multiplicand.length - (multiplicand.indexOf('.') + 1);
//     multiplicand = multiplicand.replace(/\./, '');
//   }
//
//   if (fUTF8.pos(multiplier, '.') !== false) {
//     afterDecimal += multiplier.length - (multiplier.indexOf('.') + 1);
//     multiplier = multiplier.replace(/\./, '');
//   }
//
//   var n = multiplicand.length - 1;
//   var m = multiplier.length - 1;
//
//   var product = multiplier + fUTF8.pad('', n, '0');
//
//   // Make into arrays for ease of use
//   var toArray = fNumber._toArray;
//   multiplicand = toArray(multiplicand);
//   multiplier = toArray(multiplier);
//   product = toArray(product);
//   product[0] = multiplicand[0] == multiplier[0] ? '+' : '-';
//
//   var j = m, i, k, t;
//
//   while (j > 0) {
//     if (multiplier[j] === '0') {
//       product[j] = '0';
//     }
//
//     i = n;
//     k = 0;
//
//     while (i > 0) {
//       t = (multiplicand[i] + multiplier[j]) + product[i+j] + k;
//       product[i+j] = t % 10;
//       k = t / 10;
//       --i;
//     }
//     product[j] = k;
//
//     --j;
//   }
//
//   product = product.join('');
//
//   var integer = product.substr(0, product.length - afterDecimal);
//   var fraction = product.substr(product.length - afterDecimal);
//   fraction = fraction.length ? '.' + fraction : '';
//
//   product = integer + fraction;
//
//   product = fNumber._setScale(product, scale);
//   product = fNumber.stripLeadingZeroes(product);
//
//   return product;
// };
// /**
//  * Multiplies against this number.
//  * @param {fNumber|number|string} multiplier The multiplier.
//  * @param {number} [scale] The number of places after the decimal.
//  * @returns {fNumber} The product.
//  */
// fNumber.prototype.mul = function (multiplier, scale) {
//   scale = fNumber._fixScale(scale);
//   multiplier = fNumber.parse(multiplier.toString(), 'number').toString();
//
//   var value = fNumber._performMul(this._value, multiplier, scale);
//
//   return new fNumber(value, scale);
// };
// /**
//  * Calculates the integer power of a number.
//  * @param {string} number The number to raise to the power.
//  * @param {string} power The power to raise to. Must be betweeen
//  *   <code>−2,147,483,648</code> and <code>2,147,483,647</code>.
//  * @param {number} [scale] The number of places after the decimal point.
//  * @returns {string|boolean} The product. False if the product cannot be
//  *   computed.
//  */
// fNumber._performPow = function (number, power, scale) {
//   number = fNumber._fixSign(number);
//   power = fNumber._fixSign(power);
//   scale = fNumber._fixScale(scale);
//
//   if (fNumber._cmp(power, '-2147483648') < 0 || fNumber._cmp(power, '+2147483648') > 0) {
//     fCore.debug('The power specified, %s, is beyond the range of supported powers.', power);
//     return false;
//   }
//
//   if (fNumber.isZero(power)) {
//     return '+1';
//   }
//
//   var negativePower = power.charAt(0) === '-';
//   var product;
//
//   power = '+' + power.substr(1);
//
//   // Rely on casting
//   if (power % 2 === 0) {
//     product = fNumber._performPow(fNumber._performMul(number.toString(), number.toString()), (power / 2).toString());
//   }
//   else {
//     product = fNumber._performMul(number, fNumber._performPow(fNumber._performMul(number.toString(), number.toString()), String(Math.floor(power / 2))).toString());
//   }
//
//   if (negativePower) {
//     product = fNumber._performDiv('+1', product.toString(), scale);
//   }
//
//   product = fNumber._setScale(product.toString(), scale);
//
//   return product;
// };
// /**
//  * Raise this number to the power specified.
//  * @param {number} exponent The power to raise to.
//  * @param {number} [scale] The number of places after the decimal.
//  * @returns {fNumber} The product.
//  */
// fNumber.prototype.pow = function (exponent, scale) {
//   scale = fNumber._fixScale(scale);
//
//   exponent = +exponent;
//   if (isNaN(exponent)) {
//     exponent = 1;
//   }
//
//   var value = fNumber._performPow(this._value, exponent.toString(), scale);
//
//   return new fNumber(value.toString(), scale);
// };
// /**
//  * Performs division.
//  * @private
//  * @param {string} dividend
//  * @param {string} divisor
//  * @param {number} [scale]
//  * @returns {Array|boolean}
//  * @see http://en.wikipedia.org/wiki/Multiplication_algorithm#Linear_time_multiplication
//  */
// fNumber._performDiv = function (dividend, divisor, scale) {
//   var array = fNumber._normalize(dividend, divisor);
//
//   scale = fNumber._fixScale(scale);
//   dividend = fNumber.stripLeadingZeroes(array[0]);
//   divisor = fNumber.stripLeadingZeroes(array[1]);
//
//   if (fNumber.isZero(dividend)) {
//     return [fNumber._setScale('+0', scale), '+0'];
//   }
//
//   if (fNumber.isZero(divisor)) {
//     return false;
//   }
//
//   var sign = dividend.charAt(0) === divisor.charAt(0) ? '+' : '-';
//   var afterDecimal = 0;
//
//   if (fUTF8.pos(dividend, '.') !== false) {
//     dividend = dividend.replace(/\./, '');
//     divisor = divisor.replace(/\./, '');
//   }
//
//   if (scale !== undefined) {
//     for (var i = 0; i < scale; i++) {
//       dividend += '0';
//       afterDecimal++;
//     }
//   }
//
//   if (dividend.length < divisor.length) {
//     return [fNumber._setScale('+0', scale), dividend];
//   }
//
//   // Perform multiplication using Knuth's algorithm from Art of Computer Science Vol 2
//   var u = fNumber._toArray('+' + dividend.substr(1));
//   var v = fNumber._toArray('+' + divisor.substr(1));
//
//   var n = v.length - 1;
//   var m = (u.length - 1) - n;
//   var quotient, remainder, d;
//   var j;
//
//   // For single digit divisors
//   if (n === 1) {
//     n = u.length - 1;
//     var w = fNumber._toArray(sign + fUTF8.pad('', n, '0'));
//     var r = 0;
//     j = 1;
//
//     while (j <= n) {
//       w[j] = Math.floor(((r * 10) + u[j])/v[1]);
//       r = ((r * 10) + u[j]) % v[1];
//       j++;
//     }
//     quotient = w.join('');
//     remainder = '+' + r;
//   }
//   else {
//     // Multi-digit divisors
//     quotient = fNumber._toArray('0' + fUTF8.pad('', m, '0'));
//
//     // Step D1
//     d = Math.floor(10 / (v[1] + 1));
//
//     u = fNumber._toArray(fNumber._performMul(u.join(''), d.toString()));
//     v = fNumber._toArray(fNumber._performMul(v.join(''), d.toString()));
//
//     if (u.length === dividend.length) {
//       u = '0' + u.join('').substr(1);
//     }
//     else {
//       u = u.join('').substr(1);
//     }
//
//     // Step D2
//     j = 0;
//
//     var uj1, uj2, ujn, q, borrow;
//     while (j <= m) {
//       // Step D3
//       uj1 = (u[j+1] !== undefined) ? u[j+1] : '0';
//
//       if (u[j] === v[1]) {
//         q = 9;
//       }
//       else {
//         q = Math.floor(((u[j] * 10) + uj1) / v[1]);
//       }
//
//       uj2 = (u[j+2] !== undefined) ? u[j+2] : '0';
//
//       if (v[2] * q > ((u[j] * 10) + uj1 - (q * v[1])) * 10 + uj2) {
//         q--;
//         if (v[2] * q > ((u[j] * 10) + uj1 - (q * v[1])) * 10 + uj2) {
//           q--;
//         }
//       }
//
//       // Step D4
//       ujn = fNumber._performSub(u.substr(j, n + 1), fNumber._performMul(q.toString(), v.join('')));
//       while (ujn.length - 1 < n+1) {
//         ujn = ujn.charAt(0) + '0' + ujn.substr(1);
//       }
//       while (ujn.length - 1 > n+1) {
//         ujn = ujn.charAt(0) + ujn.substr(2);
//       }
//       borrow = false;
//       if (ujn.charAt(0) === '-') {
//         ujn = fNumber._performAdd(fNumber._performPow('10', (n + 1).toString()).toString(), ujn);
//         borrow = true;
//       }
//       while (ujn.length - 1 > n+1) {
//         ujn = ujn.charAt(0) + ujn.substr(2);
//       }
//
//       // Step D5
//       if (borrow) {
//         // Step D6
//         q--;
//         ujn = fNumber._performAdd(v.join(''), ujn).substr(1);
//       }
//
//       u = u.join('').substr(0, j) + ujn.substr(1) + u.join('').substr(j+n+1);
//
//       quotient[j] = q;
//
//       // Step D7
//       j++;
//     }
//
//     remainder = fNumber._performDiv(u.join('').substr(1+m, n), d.toString());
//   }
//
//   if (quotient.length < afterDecimal) {
//     quotient = fUTF8.pad(quotient.join(''), afterDecimal+1, '0', 'left');
//   }
//
//   var integer = quotient.substr(0, quotient.length - afterDecimal);
//   var fraction = quotient.substr(quotient.length - afterDecimal);
//   fraction = fraction.length ? '.' + fraction : '';
//
//   quotient = fNumber.stripLeadingZeroes(integer + fraction);
//
//   if (quotient.charAt(0).match(/[0-9]/)) {
//     quotient = sign + quotient;
//   }
//
//   return [quotient, remainder];
// };
// /**
//  * Divides against this number.
//  * @param {number|fNumber|string} divisor The divisor.
//  * @param {number} [scale] The number of places after the decimal.
//  * @returns {boolean|fNumber} False if the divisor is zero, or the quotient.
//  */
// fNumber.prototype.div = function (divisor, scale) {
//   scale = fNumber._fixScale(scale);
//   divisor = fNumber.parse(divisor.toString(), 'number').toString();
//
//   if (fNumber.isZero(divisor)) {
//     fCore.debug('Warning: Division by zero.');
//     return false;
//   }
//
//   var value = fNumber._performDiv(this._value, divisor, scale);
//
//   if (!value) {
//     return false;
//   }
//
//   return new fNumber(value[0], scale);
// };
/**
 * Indicates if this value is equal to the one passed.
 * @param {fNumber|number|string} number The number to compare to.
 * @param {number} [scale] The number of decimal places to compare.
 * @returns {boolean} If this number is equal to the one passed.
 */
fNumber.prototype.eq = function (number, scale) {
  if (!number.toString) {
    return false;
  }

  scale = fNumber._fixScale(scale);
  number = number.toString();

  var array = fNumber._normalize(this, number, scale);

  return fNumber._cmp(array[0], array[1]) === 0 ? true : false;
};
/**
 * Indicates if this value is greater than the one passed.
 * @param {fNumber|number|string} number The number to compare to.
 * @param {number} [scale] The number of decimal places to compare.
 * @returns {boolean} If the number is greater than the one passed.
 */
fNumber.prototype.gt = function (number, scale) {
  if (!number.toString) {
    return false;
  }

  scale = fNumber._fixScale(scale);
  var array = fNumber._normalize(this, number, scale);

  return fNumber._cmp(array[0], array[1]) > 0 ? true : false;
};
/**
 * Indicates if this value is greater than or equal to the one passed.
 * @param {fNumber|number|string} number The number to compare to.
 * @param {number} [scale] The number of decimal places to compare.
 * @returns {boolean} If the number is greater than or equal to the one passed.
 */
fNumber.prototype.gte = function (number, scale) {
  if (!number.toString) {
    return false;
  }

  scale = fNumber._fixScale(scale);
  var array = fNumber._normalize(this, number, scale);

  return fNumber._cmp(array[0], array[1]) > -1 ? true : false;
};
/**
 * Indicates if this value is lesser than the one passed.
 * @param {fNumber|number|string} number The number to compare to.
 * @param {number} [scale] The number of decimal places to compare.
 * @returns {boolean} If the number is lesser than the one passed.
 */
fNumber.prototype.lt = function (number, scale) {
  if (!number.toString) {
    return false;
  }

  var array = fNumber._normalize(this, number, scale);

  return fNumber._cmp(array[0], array[1]) < 0 ? true : false;
};
/**
 * Indicates if this value is lesser than or equal to the one passed.
 * @param {fNumber|number|string} number The number to compare to.
 * @param {number} [scale] The number of decimal places to compare.
 * @returns {boolean} If the number is lesser than or equal to the one passed.
 */
fNumber.prototype.lte = function (number, scale) {
  if (!number.toString) {
    return false;
  }

  var array = fNumber._normalize(this, number, scale);

  return fNumber._cmp(array[0], array[1]) < 1 ? true : false;
};
/**
 * Scales (truncates or expands) the number to the specified number of digits
 *   after the decimal - negative scales round the number by places to the
 *   left of the decimal.
 * @param {number|string} scale The number of places after (or before if negative) the decimal.
 * @returns {fNumber} A new fNumber object.
 */
fNumber.prototype.trunc = function (scale) {
  scale = fNumber._fixScale(parseInt(scale, 10));
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
 * Rounds the number.
 * @param {number} scale The number of places after (or before if negative) the
 *   decimal to round to.
 * @returns {fNumber} The rounded result.
 */
fNumber.prototype.round = function (scale) {
  scale = fNumber._fixScale(scale);

  var number = fNumber._setScale(this._value, (scale < 0) ? 1 : scale + 1);
  var length = number.length;
  var add = false;

  if (scale === 0) {
    if (number.charAt(length - 1) >= 5) {
      add = '1';
    }
    number = number.substr(0, -2);
  }
  else if (scale > 0) {
    if (number.charAt(length - 1) >= 5) {
      add = '0.' + fUTF8.pad('', scale-1, '0') + '1';
    }
    number = number.substr(0, -1);
  }
  else {
    number = number.substr(0, number.indexOf('.'));

    if (Math.abs(scale) >= number.length) {
      number = '0';
    }
    else {
      if (number.charAt(number.length - Math.abs(scale)) >= 5) {
        add = '1' + fUTF8.pad('', Math.abs(scale), '0');
      }
      number = number.substr(0, scale);
      number += fUTF8.pad('', Math.abs(scale), '0');
    }
  }

  if (add) {
    number = fNumber._performAdd(number, add.toString(), scale);
  }

  return new fNumber(number);
};
/**
 * Subtracts two numbers.
 * @param {fNumber|string} subtrahend The subtrahend.
 * @param {number} [scale] The number of places after the decimal.
 * @returns {fNumber} The difference.
 */
fNumber.prototype.sub = function (subtrahend, scale) {
  scale = fNumber._fixScale(scale);
  subtrahend = fNumber.parse(subtrahend, 'number').toString();

  var diff = fNumber._performSub(this._value, subtrahend, scale);

  return new fNumber(diff, scale);
};
/**
 * Implements toString().
 * @returns {string} The number as a string.
 */
fNumber.prototype.toString = function () {
  if (this._value.charAt(0) === '+') {
    return String(this._value).substr(1);
  }

  return this._value.toString();
};
// NOTE Extras not original Flourish
/**
 * Get the value as an integer.
 * @returns {number} The value as an integer.
 */
fNumber.prototype.toInteger = function () {
  return parseInt(this._value.substr(1), 10);
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
    scale = fNumber._fixScale(scale);
    return this.trunc(scale).toFloat();
  }

  return parseFloat(this._value);
};
