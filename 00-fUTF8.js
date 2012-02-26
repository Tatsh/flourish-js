/**
 * This is the namespace for phpjs' ports of PHP string functions.
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
    str += '';

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
 * @param {string} [charlist=null] Optionally, the stripped characters can also be
 *   specified using the charlist parameter. Simply list all characters that
 *   you want to be stripped in a string.
 * @returns {string} The trimmed string.
 */
fUTF8.ltrim = function (str, charlist) {
    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Erkekjetter
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // *     example 1: ltrim('    Kevin van Zonneveld    ');
    // *     returns 1: 'Kevin van Zonneveld    '
    charlist = !charlist ? ' \\s\u00A0' : (charlist + '').replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
    var re = new RegExp('^[' + charlist + ']+', 'g');
    return (str + '').replace(re, '');
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
     * @type function()
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
  offset === undefined && (offset = 0);
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
