/**
 * Provides string functions for UTF-8 strings.
 * @constructor
 */
var fUTF8 = function () {};
/**
 * This function returns a string with whitespace stripped from the beginning
 *   and end of str. Without the second parameter, trim() will strip these
 *   characters:
 * <ul>
 * <li>" " (ASCII 32 (0x20)), an ordinary space.</li>
 * <li>"\t" (ASCII 9 (0x09)), a tab.</li>
 * <li>"\n" (ASCII 10 (0x0A)), a new line (line feed).</li>
 * <li>"\r" (ASCII 13 (0x0D)), a carriage return.</li>
 * <li>"\0" (ASCII 0 (0x00)), the NUL-byte.</li>
 * <li>"\x0B" (ASCII 11 (0x0B)), a vertical tab.</li>
 * </ul>
 * @param {string} str The string that will be trimmed.
 * @param {string} [charlist] Optionally, the stripped characters can also be
 *   specified using the charlist parameter. Simply list all characters that
 *   you want to be stripped in a string.
 * @returns {string} The trimmed string.
 */
fUTF8.trim = function (str, charlist) {
    if (str.trim && charlist === undefined) {
      return str.trim();
    }

    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: mdsjack (http://www.mdsjack.bo.it)
    // +   improved by: Alexander Ermolaev (http://snippets.dzone.com/user/AlexanderErmolaev)
    // +      input by: Erkekjetter
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: DxGx
    // +   improved by: Steven Levithan (http://blog.stevenlevithan.com)
    // +    tweaked by: Jack
    // +   bugfixed by: Onno Marsman
    // *     example 1: trim('    Kevin van Zonneveld    ');
    // *     returns 1: 'Kevin van Zonneveld'
    // *     example 2: trim('Hello World', 'Hdle');
    // *     returns 2: 'o Wor'
    // *     example 3: trim(16, 1);
    // *     returns 3: 6
    var whitespace, l = 0,
        i = 0;

    if (!charlist) {
        // default list
        whitespace = " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
    } else {
        // preg_quote custom list
        charlist += '';
        whitespace = charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
    }

    l = str.length;
    for (i = 0; i < l; i++) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(i);
            break;
        }
    }

    l = str.length;
    for (i = l - 1; i >= 0; i--) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(0, i + 1);
            break;
        }
    }

    return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
};
/**
 * Strip whitespace (or other characters) from the beginning of a string.
 * Without the second parameter, ltrim() will strip these characters:
 * <ul>
 * <li>" " (ASCII 32 (0x20)), an ordinary space.</li>
 * <li>"\t" (ASCII 9 (0x09)), a tab.</li>
 * <li>"\n" (ASCII 10 (0x0A)), a new line (line feed).</li>
 * <li>"\r" (ASCII 13 (0x0D)), a carriage return.</li>
 * <li>"\0" (ASCII 0 (0x00)), the NUL-byte.</li>
 * <li>"\x0B" (ASCII 11 (0x0B)), a vertical tab.</li>
 * </ul>
 * @param {string} str The input string.
 * @param {string} [charlist] Optionally, the stripped characters can also be
 *   specified using the charlist parameter. Simply list all characters that
 *   you want to be stripped in a string.
 * @returns {string} The trimmed string.
 */
fUTF8.ltrim = function (str, charlist) {
  if (str.trimLeft && charlist === undefined) {
    return str.trimLeft();
  }

    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Erkekjetter
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // *     example 1: ltrim('    Kevin van Zonneveld    ');
    // *     returns 1: 'Kevin van Zonneveld    '
    charlist = !charlist ? ' \\s\u00A0' : charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
    var re = new RegExp('^[' + charlist + ']+', 'g');
    return str.replace(re, '');
};

/**
 * Pad a string to a certain length with another string.
 * @param {string} input The input string.
 * @param {number} pad_length The character length to pad the string to.
 * @param {string} [pad_string= ] The string to pad the source string with.
 * @param {string} [pad_type='right'] One of: 'left', 'right', 'both'.
 * @returns {string} Returns the padded string.
 */
fUTF8.pad = function (input, pad_length, pad_string, pad_type) {
    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // + namespaced by: Michael White (http://getsprink.com)
    // +      input by: Marco van Oort
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // *     example 1: str_pad('Kevin van Zonneveld', 30, '-=', 'STR_PAD_LEFT');
    // *     returns 1: '-=-=-=-=-=-Kevin van Zonneveld'
    // *     example 2: str_pad('Kevin van Zonneveld', 30, '-', 'STR_PAD_BOTH');
    // *     returns 2: '------Kevin van Zonneveld-----'
    var half = '',
        pad_to_go;

    /**
     * @private
     * @param {string} s
     * @param {number} len
     * @returns {string}
     */
    var str_pad_repeater = function (s, len) {
        var collect = '',
            i;

        while (collect.length < len) {
            collect += s;
        }
        collect = collect.substr(0, len);

        return collect;
    };

    input += '';
    pad_string = pad_string !== undefined ? pad_string : ' ';

    if (pad_type != 'left' && pad_type != 'right' && pad_type != 'both') {
        pad_type = 'right';
    }
    if ((pad_to_go = pad_length - input.length) > 0) {
        if (pad_type == 'left') {
            input = str_pad_repeater(pad_string, pad_to_go) + input;
        } else if (pad_type == 'right') {
            input = input + str_pad_repeater(pad_string, pad_to_go);
        } else if (pad_type == 'both') {
            half = str_pad_repeater(pad_string, Math.ceil(pad_to_go / 2));
            input = half + input + half;
            input = input.substr(0, pad_length);
        }
    }

    return input;
};
/**
 * Finds the first position (in characters) of the search value in the string.
 * @param {string} haystack The string to search in.
 * @param {string} needle The string to search for.
 * @param {number} [offset=0] The character position to start searching from.
 * @returns {boolean|number} The character position or false if the string is
 *   not found.
 */
fUTF8.pos = function (haystack, needle, offset) {
  if (offset === undefined) {
    offset = 0;
  }

  haystack = haystack.substr(offset);

  if (!needle) {
    return false;
  }

  var index = haystack.indexOf(needle);
  if (index === -1) {
    return false;
  }

  return index;
};
/**
 * Strip whitespace (or other characters) from the end of a string.
 * Without the second parameter, ltrim() will strip these characters:
 * <ul>
 * <li>" " (ASCII 32 (0x20)), an ordinary space.</li>
 * <li>"\t" (ASCII 9 (0x09)), a tab.</li>
 * <li>"\n" (ASCII 10 (0x0A)), a new line (line feed).</li>
 * <li>"\r" (ASCII 13 (0x0D)), a carriage return.</li>
 * <li>"\0" (ASCII 0 (0x00)), the NUL-byte.</li>
 * <li>"\x0B" (ASCII 11 (0x0B)), a vertical tab.</li>
 * </ul>
 * @param {string} str The input string.
 * @param {string} [charlist=null] Optionally, the stripped characters can also be
 *   specified using the charlist parameter. Simply list all characters that
 *   you want to be stripped in a string.
 * @returns {string} The trimmed string.
 */
fUTF8.rtrim = function (str, charlist) {
  if (str.trimRight && charlist === undefined) {
    return str.trimRight();
  }
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +      input by: Erkekjetter
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   bugfixed by: Onno Marsman
  // +   input by: rem
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: rtrim('    Kevin van Zonneveld    ');
  // *     returns 1: '    Kevin van Zonneveld'
  charlist = !charlist ? ' \\s\u00A0' : charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '\\$1');
  var re = new RegExp('[' + charlist + ']+$', 'g');
  return str.replace(re, '');
};
/**
 * Compares strings using a natural order algorithm.<br>
 * License: LGPL
 * @param {string} a The first string.
 * @param {string} b The second string.
 * @returns {number} Less than 0 if f_string1 is less than f_string2, greater
 *   than 0 if f_string1 is f_string2, and 0 if they are equal.
 * @see http://www.davekoelle.com/files/alphanum.js
 */
fUTF8.natcmp = function (a, b) {
  function chunkify(t) {
    var tz = [], x = 0, y = -1, n = 0, i, j;

    while ((i = (j = t.charAt(x++)).charCodeAt(0))) {
      var m = (i == 46 || (i >=48 && i <= 57));
      if (m !== n) {
        tz[++y] = "";
        n = m;
      }
      tz[y] += j;
    }
    return tz;
  }

  var aa = chunkify(a);
  var bb = chunkify(b);

  for (var x = 0; aa[x] && bb[x]; x++) {
    if (aa[x] !== bb[x]) {
      var c = Number(aa[x]), d = Number(bb[x]);
      if (c == aa[x] && d == bb[x]) {
        return c - d;
      } else return (aa[x] > bb[x]) ? 1 : -1;
    }
  }

  return aa.length - bb.length;
};
/**
 * Converts all upper-case characters to lower-case.
 * @param {string} string The string to convert.
 * @returns {string} The input string with all upper-case characters in
 *   lower-case.
 */
fUTF8.lower = function (string) {
  return string.toLocaleLowerCase();
};
/**
 * Converts all lower-case characters to upper-case.
 * @param {string} string The string to convert.
 * @returns {string} The input string with all lower-case characters in
 *   upper-case.
 */
fUTF8.upper = function (string) {
  return string.toLocaleUpperCase();
};
/**
 * Converts a unicode value into a UTF-8 character.
 * @param {number} charPoint The character to create, decimal code
 *   point.
 * @returns {string} The character, or empty string.
 */
fUTF8.chr = function (charPoint) {
  charPoint = parseInt(charPoint, 10);

  // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/fromCharCode
  if (charPoint > 0xFFFF) {
    charPoint -= 0x10000;
    return String.fromCharCode(0xD800 + (charPoint >> 10), 0xDC00 + (charPoint & 0x3FF));
  }

  return String.fromCharCode(charPoint);
};
/**
 * Compares strings.
 * @param {string} str1 The first string to compare.
 * @param {string} str2 The second string to compare.
 * @returns {number} < 0 if str1 < str2, 0 if they are equal, > 0 if str1 >
 *   str2.
 */
fUTF8.cmp = function (str1, str2) {
  return str1.localeCompare(str2);
};
/**
 * Explodes a string on a delimiter.
 * @param {string} string The string to explode.
 * @param {string} [delimiter] The delimiter.
 * @returns {Array} The exploded string.
 */
fUTF8.explode = function (string, delimiter) {
  if (delimiter === undefined) {
    return string.split('');
  }

  return string.split(delimiter);
};
/**
 * Determines the length (in characters) of a string.
 * @param {string} string The string to measure.
 * @returns {number} The length.
 */
fUTF8.len = function (string) {
  return string.length;
};
/**
 * Compares strings in a case-insensitive manner.
 * @param {string} str1 The first string to compare.
 * @param {string} str2 The second string to compare.
 * @returns {number} < 0 if str1 < str2, 0 if they are equal, > 0 if str1 >
 *   str2.
 */
fUTF8.icmp = function (str1, str2) {
  return fUTF8.cmp(str1.toLocaleLowerCase(), str2.toLocaleLowerCase());
};
/**
 * Compares strings using a natural order algorithm in a case-insensitive
 *   manner.
 * @param {string} str1 The first string to compare.
 * @param {string} str2 The second string to compare.
 * @returns {number} < 0 if str1 < str2, 0 if they are equal, > 0 if str1 >
 *   str2.
 */
fUTF8.inatcmp = function (str1, str2) {
  return fUTF8.natcmp(str1.toLocaleLowerCase(), str2.toLocaleLowerCase());
};
/**
 * Finds the first position (in characters) of the search value in the string
 *   in a case-insensitive manner.
 * @param {string} haystack The string to search in.
 * @param {string} needle The string to search for.
 * @param {number} [offset=0] The character position to start searching from.
 * @returns {boolean|number} The character position or false if the string is
 *   not found.
 */
fUTF8.ipos = function (haystack, needle, offset) {
  return fUTF8.pos(haystack.toLocaleLowerCase(), needle.toLocaleLowerCase(), offset);
};
/**
 * Replaces matching parts of the string, with matches being done in a
 *   case-insensitive manner.
 * @param {string} string The string to perfrom replacements on.
 * @param {string|Array} search The string or array of strings to search for.
 * @param {string|Array} replace The string or array of replacements to use.
 * @returns {string} The input string with the specified replacements.
 */
fUTF8.ireplace = function (string, search, replace) {
  if (typeof search === 'string') {
    search = [search];
  }
  if (typeof replace === 'string') {
    replace = [replace];
  }

  for (var i = 0, original; i < search.length; i++) {
    if (replace[i] === undefined) {
      replace[i] = search[i];
    }

    string = string.replace(new RegExp(search[i], 'i'), replace[i]);
  }

  return string;
};
/**
 * Finds the last position (in characters) of the search value in the string.
 * @param {string} haystack String to search in.
 * @param {string} needle String to search for.
 * @param {number} [offset=0] The character position to start searching from.
 * @returns {number|boolean} The last position of the character, or boolean
 *   false if it is not found.
 */
fUTF8.rpos = function (haystack, needle, offset) {
  var i = -1;

  if (offset !== undefined) {
    i = haystack.slice(offset).lastIndexOf(needle);
    if (i !== -1) {
      i += offset;
    }
  }
  else {
    i = haystack.lastIndexOf(needle);
  }

  return i >= 0 ? i : false;
};
/**
 * Finds the last position (in characters) of the search value in the string,
 *   in a case-insensitive manner.
 * @param {string} haystack String to search in.
 * @param {string} needle String to search for.
 * @param {number} [offset=0] The character position to start searching from.
 * @returns {number|boolean} The last position of the character, or boolean
 *   false if it is not found.
 */
fUTF8.irpos = function (haystack, needle, offset) {
  return fUTF8.rpos(haystack.toLocaleLowerCase(), needle.toLocaleLowerCase(), offset);
};
/**
 *  Matches a string needle in the string haystack, returning a substring from
 *   the beginning of the needle to the end of the haystack.
 * @param {string} haystack The string to search in.
 * @param {string} needle The string to search for. This match will be done in
 *   a case-insensitive manner.
 * @param {boolean} [beforeNeedle=false] If a substring of the haystack before
 *   the needle should be returned instead of the substring from the needle to
 *   the end of the haystack.
 * @returns {string|boolean} The specified part of the haystack, or false if
 *   the needle was not found.
 */
fUTF8.istr = function (haystack, needle, beforeNeedle) {
  if (beforeNeedle === undefined) {
    beforeNeedle = false;
  }

  var lowerHaystack = haystack.toLocaleLowerCase();
  var lowerNeedle = haystack.toLocaleLowerCase();
  var pos = parseInt(fUTF8.pos(lowerHaystack, lowerNeedle), 10);

  if (isNaN(pos)) {
    return false;
  }

  if (beforeNeedle) {
    return haystack.substr(0, pos);
  }

  return haystack.substr(pos);
};
/**
 * Converts a UTF-8 character to a unicode code point. Based on phpjs version.
 * @param {string} string The character to decode.
 * @returns {string} The U+hex unicode code point for the character.
 * @see http://phpjs.org/functions/ord:483
 */
fUTF8.ord = function (string) {
    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   input by: incidence
    // *     example 1: ord('K');
    // *     returns 1: 75
    // *     example 2: ord('\uD800\uDC00'); // surrogate pair to create a single Unicode character
    // *     returns 2: 65536
    var str = string,
        code = str.charCodeAt(0);
    if (0xD800 <= code && code <= 0xDBFF) { // High surrogate (could change last hex to 0xDB7F to treat high private surrogates as single characters)
        var hi = code;
        if (str.length === 1) {
            return 'U+' + fUTF8.pad(code.toString(), 4, '0', 'left'); // This is just a high surrogate with no following low surrogate, so we return its value;
            // we could also throw an error as it is not a complete character, but someone may want to know
        }
        var low = str.charCodeAt(1);
        return 'U+' + fUTF8.pad((((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000).toString(), 4, '0', 'left');
    }
    if (0xDC00 <= code && code <= 0xDFFF) { // Low surrogate
        return 'U+' + fUTF8.pad(code.toString(), 4, '0', 'left'); // This is just a low surrogate with no preceding high surrogate, so we return its value;
        // we could also throw an error as it is not a complete character, but someone may want to know
    }
    return 'U+' + fUTF8.pad(code.toString(), 4, '0', 'left');
};
/**
 * Replaces matching parts of the string.
 * @param {string} string The string to perfrom replacements on.
 * @param {string|Array} search The string or array of strings to search for.
 * @param {string|Array} replace The string or array of replacements to use.
 * @returns {string} The input string with the specified replacements.
 */
fUTF8.replace = function (string, search, replace) {
  if (typeof search === 'string') {
    search = [search];
  }
  if (typeof replace === 'replace') {
    replace = [replace];
  }

  for (var i = 0; i < search.length; i++) {
    if (replace[i] === undefined) {
      replace[i] = search[i];
    }

    string = string.replace(new RegExp(search[i]), replace[i]);
  }

  return string;
};
/**
 * Reverses a string.
 * @param {string} string The string to reverse.
 * @returns {string} The reversed string.
 */
fUTF8.rev = function (string) {
  return string.split('').reverse().join('');
};
/**
 *  Matches a string needle in the string haystack, returning a substring from
 *   the beginning of the needle to the end of the haystack.
 * @param {string} haystack The string to search in.
 * @param {string} needle The string to search for. This match will be done in
 *   a case-insensitive manner.
 * @param {boolean} [beforeNeedle=false] If a substring of the haystack before
 *   the needle should be returned instead of the substring from the needle to
 *   the end of the haystack.
 * @returns {string|boolean} The specified part of the haystack, or false if
 *   the needle was not found.
 */
fUTF8.str = function (haystack, needle, beforeNeedle) {
  var pos = parseInt(fUTF8.pos(haystack, needle), 10);

  if (isNaN(pos)) {
    return false;
  }

  if (beforeNeedle) {
    return haystack.substr(0, pos);
  }

  return haystack.substr(pos);
};
/**
 * Extracts part of a string.
 * @param {string} string The string to extract from.
 * @param {number} start The zero-based starting index.
 * @param {number} [length] The length of the returned string.
 * @returns {string|boolean} The extracted substring or false.
 */
fUTF8.sub = function (string, start, length) {
  if (Math.abs(start) > string.length) {
    return false;
  }

  if (start > (string.length / 2)) {
    start = 0 - (string.length - start);
  }

  string = string.substr(start);

  if (length === undefined) {
    return string;
  }

  return string.substr(0, length);
};
/**
 * Converts the first character of the string to upper-case.
 * @param {string} string The string to process.
 * @returns {string} The processed string.
 */
fUTF8.ucfirst = function (string) {
  return fUTF8.upper(string.substr(0, 1)) + fUTF8.sub(string, 1);
};
/**
 * Converts the first character of every word to upper-case. Currently, this
 *   only works for ASCII strings.<br>
 * Thanks to mauke in ##javascript for the regular expression.
 * @param {string} str The string to process.
 * @returns {string} The processed string.
 */
fUTF8.ucwords = function (str) {
  // JavaScript seems to have less problems with this compared to PHP, so this should work most of the time
  // 'ⓔ ἡ ᾥ ａ ჴ ց ր' -> Ⓔ Ἡ ᾭ Ａ ჴ Ց Ր
  return str.replace(/(?:^|\s)\S/g, function ($1) {
    return $1.toUpperCase();
  });
};
/**
 * Wraps a string to a specific character width.
 * @param {string} str The string to wrap.
 * @param {number} [width=75] The charcter width to wrap to.
 * @param {string} [breakChar] The string to insert as a break. Default is a
 *   newline character.
 * @param {boolean} [cut=false] If words longer than the character width should
 *   be split to fit.
 * @returns {string} The given string wrapped at the specified column.
 * @see http://phpjs.org/functions/wordwrap:581
 */
fUTF8.wordwrap = function (str, width, breakChar, cut) {
    // http://kevin.vanzonneveld.net
    // +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // +   improved by: Nick Callen
    // +    revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Sakimori
    // +   bugfixed by: Michael Grier
    // *     example 1: wordwrap('Kevin van Zonneveld', 6, '|', true);
    // *     returns 1: 'Kevin |van |Zonnev|eld'
    // *     example 2: wordwrap('The quick brown fox jumped over the lazy dog.', 20, '<br />\n');
    // *     returns 2: 'The quick brown fox <br />\njumped over the lazy<br />\n dog.'
    // *     example 3: wordwrap('Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.');
    // *     returns 3: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod \ntempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim \nveniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea \ncommodo consequat.'
    // PHP Defaults
    var m = ((arguments.length >= 2) ? arguments[1] : 75);
    var b = ((arguments.length >= 3) ? arguments[2] : "\n");
    var c = ((arguments.length >= 4) ? arguments[3] : false);

    var i, j, l, s, r;

    str += '';

    if (m < 1) {
        return str;
    }

    for (i = -1, l = (r = str.split(/\r\n|\n|\r/)).length; ++i < l; r[i] += s) {
        for (s = r[i], r[i] = ""; s.length > m; r[i] += s.slice(0, j) + ((s = s.slice(j)).length ? b : "")) {
            j = c == 2 || (j = s.slice(0, m + 1).match(/\S*(\s)?$/))[1] ? m : j.input.length - j[0].length || c == 1 && m || j.input.length + (j = s.slice(m).match(/^\S*/)).input.length;
        }
    }

    return r.join("\n");
};
