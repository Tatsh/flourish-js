/*jshint expr:true */
/** @license php.js phpjs.org | http://phpjs.org/pages/license/#MIT ,
 * alphanum.js (c) Brian Huisman | http://www.gnu.org/licenses/lgpl.html ,
 * flourish-js | http://www.opensource.org/licenses/mit-license.php ,
 * Based on original project by Will Bond: http://flourishlib.com
 */

/**
 * Return a formatted string (phpjs version).
 * @param {string} fmt The format string is composed of zero or more
 *   directives: ordinary characters (excluding %) that are copied directly to
 *   the result, and conversion specifications, each of which results in
 *   fetching its own parameter.
 * @param {...} [args] Variable number of arguments specified according to the format
 *   string.
 * @returns {string} String with the format specified in the first argument.
 * @see http://www.php.net/manual/en/function.sprintf.php
 * @private
 */
var sprintf = function (fmt, args) {
    // http://kevin.vanzonneveld.net
    // +   original by: Ash Searle (http://hexmen.com/blog/)
    // + namespaced by: Michael White (http://getsprink.com)
    // +    tweaked by: Jack
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Paulo Freitas
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // *     example 1: sprintf("%01.2f", 123.1);
    // *     returns 1: 123.10
    // *     example 2: sprintf("[%10s]", 'monkey');
    // *     returns 2: '[    monkey]'
    // *     example 3: sprintf("[%'#10s]", 'monkey');
    // *     returns 3: '[####monkey]'
    var regex = /%%|%(\d+\$)?([\-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuidfegEG])/g;
    var a = arguments,
        i = 0,
        format = a[i++];

    // pad()
    var pad = function (str, len, chr, leftJustify) {
        if (!chr) {
            chr = ' ';
        }
        var padding = (str.length >= len) ? '' : Array(1 + len - str.length >>> 0).join(chr);
        return leftJustify ? str + padding : padding + str;
    };

    // justify()
    /**
     * @param {string} value
     * @param {string} prefix
     * @param {boolean} leftJustify
     * @param {number} minWidth
     * @param {boolean} [zeroPad]
     * @param {string} [customPadChar]
     * @returns {string}
     * @private
     */
    var justify = function (value, prefix, leftJustify, minWidth, zeroPad, customPadChar) {
        var diff = minWidth - value.length;
        if (diff > 0) {
            if (leftJustify || !zeroPad) {
                value = pad(value, minWidth, customPadChar, leftJustify);
            } else {
                value = value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length);
            }
        }
        return value;
    };

    // formatBaseX()
    var formatBaseX = function (value, base, prefix, leftJustify, minWidth, precision, zeroPad) {
        // Note: casts negative numbers to positive ones
        var number = value >>> 0;
        prefix = prefix && number && {
            '2': '0b',
            '8': '0',
            '16': '0x'
        }[base] || '';
        value = prefix + pad(number.toString(base), precision || 0, '0', false);
        return justify(value, prefix, leftJustify, minWidth, zeroPad);
    };

    // formatString()
    /**
     * @param {string} value
     * @param {boolean} leftJustify
     * @param {number} minWidth
     * @param {number} [precision]
     * @param {boolean} [zeroPad]
     * @param {string} [customPadChar]
     * @returns {string}
     * @private
     */
    var formatString = function (value, leftJustify, minWidth, precision, zeroPad, customPadChar) {
        if (precision) {
          precision = parseInt(precision, 10);
          if (!isNaN(precision)) {
            value = value.slice(0, precision);
          }
        }
        return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
    };

    // doFormat()
    var doFormat = function (substring, valueIndex, flags, minWidth, _, precision, type) {
        var number;
        var prefix;
        var method;
        var textTransform;
        var value;

        if (substring == '%%') {
            return '%';
        }

        // parse flags
        var leftJustify = false,
            positivePrefix = '',
            zeroPad = false,
            prefixBaseX = false,
            customPadChar = ' ';
        var flagsl = flags.length;
        for (var j = 0; flags && j < flagsl; j++) {
            switch (flags.charAt(j)) {
            case ' ':
                positivePrefix = ' ';
                break;
            case '+':
                positivePrefix = '+';
                break;
            case '-':
                leftJustify = true;
                break;
            case "'":
                customPadChar = flags.charAt(j + 1);
                break;
            case '0':
                zeroPad = true;
                break;
            case '#':
                prefixBaseX = true;
                break;
            }
        }

        // parameters may be null, undefined, empty-string or real valued
        // we want to ignore null, undefined and empty-string values
        if (!minWidth) {
            minWidth = 0;
        } else if (minWidth == '*') {
            minWidth = +a[i++];
        } else if (minWidth.charAt(0) == '*') {
            minWidth = +a[minWidth.slice(1, -1)];
        }
        else if (!isFinite(minWidth)) {
          minWidth = 0;
        } else {
            minWidth = +minWidth;
        }

        // Note: undocumented perl feature:
        if (minWidth < 0) {
            minWidth = -minWidth;
            leftJustify = true;
        }

//         if (!isFinite(minWidth)) {
//             throw new Error('sprintf: (minimum-)width must be finite');
//         }

        if (!precision) {
            precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type == 'd') ? 0 : undefined;
        } else if (precision == '*') {
            precision = +a[i++];
        } else if (precision.charAt(0) == '*') {
            precision = +a[precision.slice(1, -1)];
        } else {
            precision = +precision;
        }

        // grab value using valueIndex if required?
        value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];

        switch (type) {
        case 's':
            return formatString(String(value), leftJustify, minWidth, precision, zeroPad, customPadChar);
        case 'c':
            return formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad);
        case 'b':
            return formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
        case 'o':
            return formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
        case 'x':
            return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
        case 'X':
            return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad).toUpperCase();
        case 'u':
            return formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
        case 'i':
        case 'd':
            number = (+value) | 0;
            prefix = number < 0 ? '-' : positivePrefix;
            value = prefix + pad(String(Math.abs(number)), precision, '0', false);
            return justify(value, prefix, leftJustify, minWidth, zeroPad);
        case 'e':
        case 'E':
        case 'f':
        case 'F':
        case 'g':
        case 'G':
            number = +value;
            prefix = number < 0 ? '-' : positivePrefix;
            method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
            textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2];
            value = prefix + Math.abs(number)[method](precision);
            return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]();
        default:
            return substring;
        }
    };

    return format.replace(regex, doFormat);
};

/**
 * Parse about any English textual datetime description into a UNIX timestamp.
 * @param {string} str A date/time string.
 * @param {number|Date} [now=null] The timestamp which is used as a base for
 *   the calculation of relative dates.
 * @returns {number|boolean} Returns a timestamp on success, false otherwise.
 * @private
 */
var strtotime = function (str, now) {
    // http://kevin.vanzonneveld.net
    // +   original by: Caio Ariede (http://caioariede.com)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: David
    // +   improved by: Caio Ariede (http://caioariede.com)
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Wagner B. Soares
    // +   bugfixed by: Artur Tchernychev
    // %        note 1: Examples all have a fixed timestamp to prevent tests to fail because of variable time(zones)
    // *     example 1: strtotime('+1 day', 1129633200);
    // *     returns 1: 1129719600
    // *     example 2: strtotime('+1 week 2 days 4 hours 2 seconds', 1129633200);
    // *     returns 2: 1130425202
    // *     example 3: strtotime('last month', 1129633200);
    // *     returns 3: 1127041200
    // *     example 4: strtotime('2009-05-04 08:30:00');
    // *     returns 4: 1241418600
    var i, l, match, s, parse = '';

    str = str.replace(/\s{2,}|^\s|\s$/g, ' '); // unecessary spaces
    str = str.replace(/[\t\r\n]/g, ''); // unecessary chars
    if (str === 'now') {
        return now === null || isNaN(now) ? new Date().getTime() / 1000 | 0 : now | 0;
    } else if (!isNaN(parse = Date.parse(str))) {
        return parse / 1000 | 0;
    } else if (now) {
        now = new Date(now * 1000); // Accept PHP-style seconds
    } else {
        now = new Date();
    }

    str = str.toLowerCase();

    var __is = {
        day: {
            'sun': 0,
            'mon': 1,
            'tue': 2,
            'wed': 3,
            'thu': 4,
            'fri': 5,
            'sat': 6
        },
        mon: [
            'jan',
            'feb',
            'mar',
            'apr',
            'may',
            'jun',
            'jul',
            'aug',
            'sep',
            'oct',
            'nov',
            'dec'
        ]
    };

    var process = function (m) {
        var ago = (m[2] && m[2] === 'ago');
        var num = (m[0] === 'last' ? -1 : 1) * (ago ? -1 : 1);

        switch (m[0]) {
        case 'last':
        case 'next':
            switch (m[1].substring(0, 3)) {
            case 'yea':
                now.setFullYear(now.getFullYear() + num);
                break;
            case 'mon':
                now.setMonth(now.getMonth() + num);
                break;
            case 'wee':
                now.setDate(now.getDate() + (num * 7));
                break;
            case 'day':
                now.setDate(now.getDate() + num);
                break;
            case 'hou':
                now.setHours(now.getHours() + num);
                break;
            case 'min':
                now.setMinutes(now.getMinutes() + num);
                break;
            case 'sec':
                now.setSeconds(now.getSeconds() + num);
                break;
            default:
                var day = __is.day[m[1].substring(0, 3)];
                if (typeof day !== 'undefined') {
                    var diff = day - now.getDay();
                    if (diff === 0) {
                        diff = 7 * num;
                    } else if (diff > 0) {
                        if (m[0] === 'last') {
                            diff -= 7;
                        }
                    } else {
                        if (m[0] === 'next') {
                            diff += 7;
                        }
                    }
                    now.setDate(now.getDate() + diff);
                }
            }
            break;

        default:
            if (/\d+/.test(m[0])) {
                num *= parseInt(m[0], 10);

                switch (m[1].substring(0, 3)) {
                case 'yea':
                    now.setFullYear(now.getFullYear() + num);
                    break;
                case 'mon':
                    now.setMonth(now.getMonth() + num);
                    break;
                case 'wee':
                    now.setDate(now.getDate() + (num * 7));
                    break;
                case 'day':
                    now.setDate(now.getDate() + num);
                    break;
                case 'hou':
                    now.setHours(now.getHours() + num);
                    break;
                case 'min':
                    now.setMinutes(now.getMinutes() + num);
                    break;
                case 'sec':
                    now.setSeconds(now.getSeconds() + num);
                    break;
                }
            } else {
                return false;
            }
            break;
        }
        return true;
    };

    match = str.match(/^(\d{2,4}-\d{2}-\d{2})(?:\s(\d{1,2}:\d{2}(:\d{2})?)?(?:\.(\d+))?)?$/);
    if (match !== null) {
        if (!match[2]) {
            match[2] = '00:00:00';
        } else if (!match[3]) {
            match[2] += ':00';
        }

        s = match[1].split(/-/g);

        s[1] = __is.mon[s[1] - 1] || s[1];
        s[0] = String(+s[0]);

        s[0] = (s[0] >= 0 && s[0] <= 69) ? '20' + (s[0] < 10 ? '0' + s[0] : s[0] + '') : (s[0] >= 70 && s[0] <= 99) ? '19' + s[0] : s[0] + '';
        return parseInt(strtotime(s[2] + ' ' + s[1] + ' ' + s[0] + ' ' + match[2]) + (match[4] ? match[4] / 1000 : ''), 10);
    }

    var regex = /([+\-]?\d+\s(years?|months?|weeks?|days?|hours?|min|minutes?|sec|seconds?|sun\.?|sunday|mon\.?|monday|tue\.?|tuesday|wed\.?|wednesday|thu\.?|thursday|fri\.?|friday|sat\.?|saturday)|(last|next)\s(years?|months?|weeks?|days?|hours?|min|minutes?|sec|seconds?|sun\.?|sunday|mon\.?|monday|tue\.?|tuesday|wed\.?|wednesday|thu\.?|thursday|fri\.?|friday|sat\.?|saturday))(\sago)?/gi;

    match = str.match(regex);
    if (match === null) {
        return false;
    }

    for (i = 0, l = match.length; i < l; i++) {
        if (!process(match[i].split(' '))) {
            return false;
        }
    }

    return now.getTime() / 1000 | 0;
};
/**
 * Gets the keys from an object.
 * @param {Object} obj The object to get keys from.
 * @param {boolean} [sort=false] Set to <em>true</em> to sort the keys.
 * @returns {Array} Array of strings.
 * @private
 */
var objectKeys = function (obj, sort) {
  sort === undefined && (sort = false);

  var ret;

  if (Object.keys) {
    ret = Object.keys(obj || {});
  }
  else {
    ret = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        ret.push(key);
      }
    }
  }

  if (sort) {
    ret.sort();
  }

  return ret;
};
/**
 * Checks if a value exists in an array.
 * @param {string|number|boolean} value The value to search for.
 * @param {Array} arr The array to search within.
 * @returns {boolean} If the value exists in the array.
 * @private
 */
var inArray = function (value, arr) {
  if (arr.indexOf) {
    return arr.indexOf(value) !== -1;
  }

  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === value) {
      return true;
    }
  }

  return false;
};
/**
 * Get the index of a value within an array.
 * @param {string|number|boolean} value The value to search for.
 * @param {Array} arr The array to search within.
 * @returns {number} The index of <code>value</code> in the array, or
 *   <code>-1</code> if the value does not exist.
 * @private
 */
var arrayIndexOf = function (value, arr) {
  if (arr.indexOf) {
    return arr.indexOf(value);
  }

  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === value) {
      return i;
    }
  }

  return -1;
};
/**
 * Check if an object is really an Object (made with <code>{}</code>).
 * @param {Object} obj Object to check.
 * @returns {boolean} If the variable is an object.
 * @private
 */
var objectIsObject = function (obj) {
  if (Object.prototype.toString.call(obj) !== '[object Object]') {
    return false;
  }

  for (var key in obj) {}

  return !key || Object.hasOwnProperty(obj, key);
};
/**
 * Check if an array is an actual array (and not array-like).
 * @param {Array} arr Array to check.
 * @returns {boolean} If the variable is an array.
 * @private
 */
var arrayIsArray = function (arr) {
  if (Array.isArray) {
    return Array.isArray(arr);
  }

  return Object.prototype.toString.call(arr) === '[object Array]';
};
/**
 * Translate characters or replace substrings.
 *
 * @param {string} str The string being translated.
 * @param {string|Object} from The string being translated to to. If object,
 *   should be replacement pairs.
 * @param {string} [to] The string replacing from.
 * @returns {string|boolean} Returns the translated string. If the replacement
 *   pairs argument contains a key which is an empty string, <code>false</code>
 *   will be returned.
 */
var strtr = function (str, from, to) {
    // http://kevin.vanzonneveld.net
    // +   original by: Brett Zamir (http://brett-zamir.me)
    // +      input by: uestla
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Alan C
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Taras Bogach
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +      input by: jpfle
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // -   depends on: krsort
    // -   depends on: ini_set
    // *     example 1: $trans = {'hello' : 'hi', 'hi' : 'hello'};
    // *     example 1: strtr('hi all, I said hello', $trans)
    // *     returns 1: 'hello all, I said hi'
    // *     example 2: strtr('äaabaåccasdeöoo', 'äåö','aao');
    // *     returns 2: 'aaabaaccasdeooo'
    // *     example 3: strtr('ääääääää', 'ä', 'a');
    // *     returns 3: 'aaaaaaaa'
    // *     example 4: strtr('http', 'pthxyz','xyzpth');
    // *     returns 4: 'zyyx'
    // *     example 5: strtr('zyyx', 'pthxyz','xyzpth');
    // *     returns 5: 'http'
    // *     example 6: strtr('aa', {'a':1,'aa':2});
    // *     returns 6: '2'
    var fr = '',
        i = 0,
        j = 0,
        lenStr = 0,
        lenFrom = 0,
        tmpStrictForIn = false,
        fromTypeStr = '',
        toTypeStr = '',
        istr = '';
    var tmpFrom = [];
    var tmpTo = [];
    var ret = '';
    var match = false;

    // Received replace_pairs?
    // Convert to normal from->to chars
    if (typeof from === 'object') {
//         tmpStrictForIn = this.ini_set('phpjs.strictForIn', false); // Not thread-safe; temporarily set to true
//         from = window.krsort(from);
//         this.ini_set('phpjs.strictForIn', tmpStrictForIn);

        for (fr in from) {
            if (from.hasOwnProperty(fr)) {
                tmpFrom.push(fr);
                tmpTo.push(from[fr]);
            }
        }

        from = tmpFrom;
        to = tmpTo;
    }

    // Walk through subject and replace chars when needed
    lenStr = str.length;
    lenFrom = from.length;
    fromTypeStr = typeof from === 'string';
    toTypeStr = typeof to === 'string';

    for (i = 0; i < lenStr; i++) {
        match = false;
        if (fromTypeStr) {
            istr = str.charAt(i);
            for (j = 0; j < lenFrom; j++) {
                if (istr == from.charAt(j)) {
                    match = true;
                    break;
                }
            }
        } else {
            for (j = 0; j < lenFrom; j++) {
                if (str.substr(i, from[j].length) == from[j]) {
                    match = true;
                    // Fast forward
                    i = (i + from[j].length) - 1;
                    break;
                }
            }
        }
        if (match) {
            ret += toTypeStr ? to.charAt(j) : to[j];
        } else {
            ret += str.charAt(i);
        }
    }

    return ret;
};
