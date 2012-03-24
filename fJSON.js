/*jshint evil:true */
/**
 * JSON encoding and decoding.
 * @constructor
 */
var fJSON = function () {};
/**
 * @type number
 * @private
 */
fJSON.J_ARRAY_OPEN = 0;
/**
 * @type number
 * @private
 */
fJSON.J_ARRAY_COMMA = 1;
/**
 * @type number
 * @private
 */
fJSON.J_ARRAY_CLOSE = 2;
/**
 * @type number
 * @private
 */
fJSON.J_OBJ_OPEN = 3;
/**
 * @type number
 * @private
 */
fJSON.J_KEY = 4;
/**
 * @type number
 * @private
 */
fJSON.J_COLON = 5;
/**
 * @type number
 * @private
 */
fJSON.J_OBJ_COMMA = 6;
/**
 * @type number
 * @private
 */
fJSON.J_OBJ_CLOSE = 7;
/**
 * @type number
 * @private
 */
fJSON.J_INTEGER = 8;
/**
 * @type number
 * @private
 */
fJSON.J_FLOAT = 9;
/**
 * @type number
 * @private
 */
fJSON.J_TRUE = 10;
/**
 * @type number
 * @private
 */
fJSON.J_FALSE = 11;
/**
 * @type number
 * @private
 */
fJSON.J_NULL = 12;
/**
 * @type number
 * @private
 */
fJSON.J_STRING = 13;
/**
 * @type Object
 * @private
 */
fJSON.controlCharacterMap = {
  '"':   '\\"',
  '\\':  '\\\\',
  '/':   '\/',
  "\u0008": '\b',
  "\u000C": '\f',
  "\n": '\n',
  "\r": '\r',
  "\t": '\t'
};
/**
 * Hash of allowed values after other values.
 * @type Object
 * @private
 */
fJSON.nextValues = {};
fJSON.nextValues[fJSON.J_ARRAY_OPEN] = {};
fJSON.nextValues[fJSON.J_ARRAY_OPEN][fJSON.J_ARRAY_OPEN] = true;
fJSON.nextValues[fJSON.J_ARRAY_OPEN][fJSON.J_ARRAY_CLOSE] = true;
fJSON.nextValues[fJSON.J_ARRAY_OPEN][fJSON.J_OBJ_OPEN] = true;
fJSON.nextValues[fJSON.J_ARRAY_OPEN][fJSON.J_INTEGER] = true;
fJSON.nextValues[fJSON.J_ARRAY_OPEN][fJSON.J_FLOAT] = true;
fJSON.nextValues[fJSON.J_ARRAY_OPEN][fJSON.J_TRUE] = true;
fJSON.nextValues[fJSON.J_ARRAY_OPEN][fJSON.J_FALSE] = true;
fJSON.nextValues[fJSON.J_ARRAY_OPEN][fJSON.J_NULL] = true;
fJSON.nextValues[fJSON.J_ARRAY_OPEN][fJSON.J_STRING] = true;
fJSON.nextValues[fJSON.J_ARRAY_COMMA] = {};
fJSON.nextValues[fJSON.J_ARRAY_COMMA][fJSON.J_ARRAY_OPEN] = true;
fJSON.nextValues[fJSON.J_ARRAY_COMMA][fJSON.J_OBJ_OPEN] = true;
fJSON.nextValues[fJSON.J_ARRAY_COMMA][fJSON.J_INTEGER] = true;
fJSON.nextValues[fJSON.J_ARRAY_COMMA][fJSON.J_FLOAT] = true;
fJSON.nextValues[fJSON.J_ARRAY_COMMA][fJSON.J_TRUE] = true;
fJSON.nextValues[fJSON.J_ARRAY_COMMA][fJSON.J_FALSE] = true;
fJSON.nextValues[fJSON.J_ARRAY_COMMA][fJSON.J_NULL] = true;
fJSON.nextValues[fJSON.J_ARRAY_COMMA][fJSON.J_STRING] = true;
fJSON.nextValues[fJSON.J_ARRAY_CLOSE] = {};
fJSON.nextValues[fJSON.J_ARRAY_CLOSE][fJSON.J_ARRAY_CLOSE] = true;
fJSON.nextValues[fJSON.J_ARRAY_CLOSE][fJSON.J_OBJ_CLOSE] = true;
fJSON.nextValues[fJSON.J_ARRAY_CLOSE][fJSON.J_ARRAY_COMMA] = true;
fJSON.nextValues[fJSON.J_ARRAY_CLOSE][fJSON.J_OBJ_COMMA] = true;
fJSON.nextValues[fJSON.J_OBJ_OPEN] = {};
fJSON.nextValues[fJSON.J_OBJ_OPEN][fJSON.J_OBJ_CLOSE] = true;
fJSON.nextValues[fJSON.J_OBJ_OPEN][fJSON.J_KEY] = true;
fJSON.nextValues[fJSON.J_KEY] = {};
fJSON.nextValues[fJSON.J_KEY][fJSON.J_COLON] = true;
fJSON.nextValues[fJSON.J_OBJ_COMMA] = {};
fJSON.nextValues[fJSON.J_OBJ_COMMA][fJSON.J_KEY] = true;
fJSON.nextValues[fJSON.J_COLON] = {};
fJSON.nextValues[fJSON.J_COLON][fJSON.J_ARRAY_OPEN] = true;
fJSON.nextValues[fJSON.J_COLON][fJSON.J_OBJ_OPEN] = true;
fJSON.nextValues[fJSON.J_COLON][fJSON.J_INTEGER] = true;
fJSON.nextValues[fJSON.J_COLON][fJSON.J_FLOAT] = true;
fJSON.nextValues[fJSON.J_COLON][fJSON.J_TRUE] = true;
fJSON.nextValues[fJSON.J_COLON][fJSON.J_FALSE] = true;
fJSON.nextValues[fJSON.J_COLON][fJSON.J_NULL] = true;
fJSON.nextValues[fJSON.J_COLON][fJSON.J_STRING] = true;
fJSON.nextValues[fJSON.J_OBJ_CLOSE] = {};
fJSON.nextValues[fJSON.J_OBJ_CLOSE][fJSON.J_ARRAY_CLOSE] = true;
fJSON.nextValues[fJSON.J_OBJ_CLOSE][fJSON.J_OBJ_CLOSE] = true;
fJSON.nextValues[fJSON.J_OBJ_CLOSE][fJSON.J_ARRAY_COMMA] = true;
fJSON.nextValues[fJSON.J_OBJ_CLOSE][fJSON.J_OBJ_COMMA] = true;
fJSON.nextValues[fJSON.J_INTEGER] = {};
fJSON.nextValues[fJSON.J_INTEGER][fJSON.J_ARRAY_CLOSE] = true;
fJSON.nextValues[fJSON.J_INTEGER][fJSON.J_OBJ_CLOSE] = true;
fJSON.nextValues[fJSON.J_INTEGER][fJSON.J_ARRAY_COMMA] = true;
fJSON.nextValues[fJSON.J_INTEGER][fJSON.J_OBJ_COMMA] = true;
fJSON.nextValues[fJSON.J_FLOAT] = {};
fJSON.nextValues[fJSON.J_FLOAT][fJSON.J_ARRAY_CLOSE] = true;
fJSON.nextValues[fJSON.J_FLOAT][fJSON.J_OBJ_CLOSE] = true;
fJSON.nextValues[fJSON.J_FLOAT][fJSON.J_ARRAY_COMMA] = true;
fJSON.nextValues[fJSON.J_FLOAT][fJSON.J_OBJ_COMMA] = true;
fJSON.nextValues[fJSON.J_TRUE] = {};
fJSON.nextValues[fJSON.J_TRUE][fJSON.J_ARRAY_CLOSE] = true;
fJSON.nextValues[fJSON.J_TRUE][fJSON.J_OBJ_CLOSE] = true;
fJSON.nextValues[fJSON.J_TRUE][fJSON.J_ARRAY_COMMA] = true;
fJSON.nextValues[fJSON.J_TRUE][fJSON.J_OBJ_COMMA] = true;
fJSON.nextValues[fJSON.J_FALSE] = {};
fJSON.nextValues[fJSON.J_FALSE][fJSON.J_ARRAY_CLOSE] = true;
fJSON.nextValues[fJSON.J_FALSE][fJSON.J_OBJ_CLOSE] = true;
fJSON.nextValues[fJSON.J_FALSE][fJSON.J_ARRAY_COMMA] = true;
fJSON.nextValues[fJSON.J_FALSE][fJSON.J_OBJ_COMMA] = true;
fJSON.nextValues[fJSON.J_NULL] = {};
fJSON.nextValues[fJSON.J_NULL][fJSON.J_ARRAY_CLOSE] = true;
fJSON.nextValues[fJSON.J_NULL][fJSON.J_OBJ_CLOSE] = true;
fJSON.nextValues[fJSON.J_NULL][fJSON.J_ARRAY_COMMA] = true;
fJSON.nextValues[fJSON.J_NULL][fJSON.J_OBJ_COMMA] = true;
fJSON.nextValues[fJSON.J_STRING] = {};
fJSON.nextValues[fJSON.J_STRING][fJSON.J_ARRAY_CLOSE] = true;
fJSON.nextValues[fJSON.J_STRING][fJSON.J_OBJ_CLOSE] = true;
fJSON.nextValues[fJSON.J_STRING][fJSON.J_ARRAY_COMMA] = true;
fJSON.nextValues[fJSON.J_STRING][fJSON.J_OBJ_COMMA] = true;

fJSON._stack = [];

/**
 * @private
 * @param {number|null} last
 * @param {string} element
 * @returns {number}
 */
fJSON.getElementType = function (last, element) {
  if (element === '[') {
    return fJSON.J_ARRAY_OPEN;
  }
  if (element === ']') {
    return fJSON.J_ARRAY_CLOSE;
  }
  if (element === '{') {
    return fJSON.J_OBJ_OPEN;
  }
  if (element === '}') {
    return fJSON.J_OBJ_CLOSE;
  }
  if (!isNaN(parseInt(element, 10)) && element.indexOf('.') === -1) {
    return fJSON.J_INTEGER;
  }
  if (!isNaN(parseFloat(element))) {
    return fJSON.J_FLOAT;
  }
  if (element === 'true') {
    return fJSON.J_TRUE;
  }
  if (element === 'false') {
    return fJSON.J_FALSE;
  }
  if (element === 'null') {
    return fJSON.J_NULL;
  }

  var lastStack = fJSON._stack[fJSON._stack.length - 1];
  if (element === ',' && lastStack[0] === fJSON.J_ARRAY_OPEN) {
    return fJSON.J_ARRAY_COMMA;
  }

  if (element === ',') {
    return fJSON.J_OBJ_COMMA;
  }

  if (element === ':') {
    return fJSON.J_COLON;
  }

  if (last === fJSON.J_OBJ_OPEN || last === fJSON.J_OBJ_COMMA) {
    return fJSON.J_KEY;
  }

  return fJSON.J_STRING;
};
/**
 * @param {number} type
 * @param {string} element
 * @private
 * @returns {string|number|null|boolean}
 */
fJSON.scalarize = function (type, element) {
  var ret = null;

  if (type === fJSON.J_INTEGER) {
    ret = parseInt(element, 10);
    if (isNaN(ret)) {
      ret = 0;
    }
  }
  if (type === fJSON.J_FLOAT) {
    ret = parseFloat(element);
    if (isNaN(ret)) {
      ret = 0;
    }
  }
  if (type === fJSON.J_FALSE) {
    ret = false;
  }
  if (type === fJSON.J_TRUE) {
    ret = true;
  }
  if (type === fJSON.J_STRING || type === fJSON.J_KEY) {
    ret = element.substr(1, element.length - 2);

    for (var key in fJSON.controlCharacterMap) {
      ret = ret.replace(new RegExp(fJSON.controlCharacterMap[key], 'g'), key);
    }

    ret = ret.replace(/\\\\u([0-9a-fA-F]{4})/, function (m0, m1) {
      return fUTF8.chr(m1);
    });
  }

  return ret;
};
/**
 * Decode a JSON string.
 * @param {string} json JSON string to decode.
 * @param {boolean} [useNative=true] Pass <code>false</code> to force not using
 *   <code>window.JSON</code> (if it is available) or the other native fallback
 *   that uses <code>eval()</code> (based on json2).
 * @returns {*} An object, array, string, number, or null. Can also return
 *   undefined. However, if the non-native decoder is used, only the mentioned
 *   types can be returned.
 */
fJSON.decode = function (json, useNative) {
  if (json === undefined) {
    return null;
  }
  if (useNative === undefined) {
    useNative = true;
  }

  if (window.JSON && window.JSON.parse && useNative) {
    try {
      return window.JSON.parse(json);
    }
    catch (e) {
      return null;
    }
  }
  else if (useNative) {
    // http://kevin.vanzonneveld.net
    // +      original by: Public Domain (http://www.json.org/json2.js)
    // + reimplemented by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      improved by: T.J. Leahy
    // +      improved by: Michael White
    // +      edited by: Andrew Udvare (for use by fJSON)
    // *        example 1: json_decode('[\n    "e",\n    {\n    "pluribus": "unum"\n}\n]');
    // *        returns 1: ['e', {pluribus: 'unum'}]
/*
        http://www.JSON.org/json2.js
        2008-11-19
        Public Domain.
        NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
        See http://www.JSON.org/js.html
    */
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var j;
    var text = json.toString();

    // Parsing happens in four stages. In the first stage, we replace certain
    // Unicode characters with escape sequences. JavaScript handles many characters
    // incorrectly, either silently deleting them, or treating them as line endings.
    cx.lastIndex = 0;
    if (cx.test(text)) {
      text = text.replace(cx, function (a) {
        return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
      });
    }

    // In the second stage, we run the text against regular expressions that look
    // for non-JSON patterns. We are especially concerned with '()' and 'new'
    // because they can cause invocation, and '=' because it can cause mutation.
    // But just to be safe, we want to reject all unexpected forms.
    // We split the second stage into 4 regexp operations in order to work around
    // crippling inefficiencies in IE's and Safari's regexp engines. First we
    // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
    // replace all simple value tokens with ']' characters. Third, we delete all
    // open brackets that follow a colon or comma or that begin the text. Finally,
    // we look to see that the remaining characters are only whitespace or ']' or
    // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.
    var testText = text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@');
    testText = testText.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
    testText = testText.replace(/(?:^|:|,)(?:\s*\[)+/g, '');

    if (/^[\],:{}\s]*$/.test(testText)) {
      // In the third stage we use the eval function to compile the text into a
      // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
      // in JavaScript: it can begin a block or an object literal. We wrap the text
      // in parens to eliminate the ambiguity.
      return eval('(' + text + ')');
    }

    fJSON.lastError = 4;
    return null;
  }

  // NOTE This port is much slower than JSON.parse and eval (~2% the speed of either Chrome). It is only here for study purposes.
  fJSON._stack = [];

  var type;
  var intNumber = parseInt(json, 10);
  var floatNumber = parseFloat(json);
  if (intNumber.toString() === json) {
    return intNumber;
  }
  else if (floatNumber.toString() === json) {
    return floatNumber;
  }

  json = fUTF8.trim(json);

  if (json === '') {
    return null;
  }

  // If the value is just true, false, or null return the real value back
  if (json === 'true' || json === 'false' || json === 'null') {
    switch (json) {
      case 'true':
        return true;
      case 'false':
        return false;
    }
    return null;
  }

  var matchedLength = 0, matches;
  var last = null;
  var lastKey = null;
  var output = null;
  var container = null;
  var refMatch;
  var newContainer;
  var stackEnd;

/*
    preg_match_all('~\[|                   # Array begin
             \]|                   # Array end
             {|                    # Object begin
             }|                    # Object end
             -?(?:0|[1-9]\d*)                        # Float
               (?:\.\d*(?:[eE][+\-]?\d+)?|
               (?:[eE][+\-]?\d+))|
             -?(?:0|[1-9]\d*)|             # Integer
             true|                   # True
             false|                    # False
             null|                   # Null
             ,|                    # Member separator for arrays and objects
             :|                    # Value separator for objects
             "(?:(?:(?!\\\\u)[^\\\\"\n\b\f\r\t]+)|   # String
               \\\\\\\\|
               \\\\/|
               \\\\"|
               \\\\b|
               \\\\f|
               \\\\n|
               \\\\r|
               \\\\t|
               \\\\u[0-9a-fA-F]{4})*"|
             \s+                   # Whitespace
             ~x', $json, $matches);
*/

  // IE 7 has trouble with escaped '/' which is \/, so replace all real \ with nothing
  if (json.indexOf('\/')) {
    json = json.replace(/\\/g, '');
  }

  // Ugly, just combined version of the above
  matches = json.match(/\[|\]|\{|\}|-?(?:0|[1-9]\d*)(?:\.\d*(?:[eE][+\-]?\d+)?|(?:[eE][+\-]?\d+))|-?(?:0|[1-9]\d*)|true|false|null|,|\:|"(?:(?:(?!\\\\u)[^\\\\"\n\b\f\r\t]+)|\\\\\\\\|\\\\\/|\\\\"|\\\\b|\\\\f|\\\\n|\\\\r|\\\\t|\\\\u[0-9a-fA-F]{4})*"|\s+/g);

  // JSON is just a simple string
  if (matches === null) {
    return json;
  }

  // IE7 creates blanks for some reason
  var replace = [];
  for (var i = 0; i < matches.length; i++) {
    if (matches[i] !== '') {
      replace.push(matches[i]);
    }
  }
  matches = replace;

  if (matches[0] !== '[' && matches[0] !== '{') {
    return null; // invalid JSON
  }

  var match;
  for (i = 0; i < matches.length; i++) {
    match = matches[i];

    if (matchedLength === 0) {
      if (match === '[') {
        output = [];
        last = fJSON.J_ARRAY_OPEN;
      }
      else {
        output = {};
        last = fJSON.J_OBJ_OPEN;
      }
      fJSON._stack.push([last, output]);
      container = output;
      matchedLength = 1;
      continue;
    }

    matchedLength += match.length;

    // Skip over white space
    if (fUTF8.trim(match) === '') {
      continue;
    }

    type = fJSON.getElementType(last, match);

    // Invalid JSON
    if (fJSON.nextValues[last][type] === undefined) {
      break;
    }

    // Decode the data values
    match = fJSON.scalarize(type, match);

    if (type === fJSON.J_COLON ||
        type === fJSON.J_OBJ_COMMA ||
        type === fJSON.J_ARRAY_COMMA ||
        type === fJSON.J_KEY) {
      last = type;
      if (type === fJSON.J_KEY) {
        lastKey = match;
      }
      continue;
    }

    // Flag used to indicate if an or object is being added
    refMatch = false;

    // Close an object or array
    if (type === fJSON.J_OBJ_CLOSE || type === fJSON.J_ARRAY_CLOSE) {
      fJSON._stack.pop();
      if (fJSON._stack.length === 0) {
        break;
      }

      newContainer = fJSON._stack[fJSON._stack.length - 1];
      container = newContainer[1];
      last = type;
      continue;
    }

    // Opening a new object
    if (type === fJSON.J_OBJ_OPEN) {
      match = {};
      refMatch = true;
    }
    if (type === fJSON.J_ARRAY_OPEN) {
      match = [];
      refMatch = true;
    }

    if (refMatch) {
      fJSON._stack.push([type, match]);
      stackEnd = fJSON._stack[fJSON._stack.length - 1];
    }

    if (last === fJSON.J_COLON) {
      if (refMatch) {
        container[lastKey] = stackEnd[1];
        container = stackEnd[1];
      }
      else {
        container[lastKey] = match;
      }
    }
    else {
      if (refMatch) {
        container.push(stackEnd[1]);
        container = stackEnd[1];
      }
      else {
        container.push(match);
      }
    }

    if (last === fJSON.J_COLON) {
      lastKey = null;
    }
    last = type;
  }

  if (matchedLength !== json.length || fJSON._stack.length > 0) {
    return null;
  }

  return output;
};
/**
 * Encode a JavaScript object to a JSON string.
 * @param {Array|Object|number|string|boolean} mixed_val Value to encode.
 * @returns {string|null} JSON string or <code>null</code>.
 */
fJSON.encode = function (mixed_val) {
    // http://kevin.vanzonneveld.net
    // +      original by: Public Domain (http://www.json.org/json2.js)
    // + reimplemented by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      improved by: Michael White
    // +      input by: felix
    // +      bugfixed by: Brett Zamir (http://brett-zamir.me)
    // *        example 1: json_encode(['e', {pluribus: 'unum'}]);
    // *        returns 1: '[\n    "e",\n    {\n    "pluribus": "unum"\n}\n]'
/*
        http://www.JSON.org/json2.js
        2008-11-19
        Public Domain.
        NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
        See http://www.JSON.org/js.html
    */
    var retVal, json = window.JSON;
    try {
        if (typeof json === 'object' && typeof json.stringify === 'function') {
            retVal = json.stringify(mixed_val); // Errors will not be caught here if our own equivalent to resource
            if (retVal === undefined) {
                //throw new SyntaxError('json_encode');
                fCore.debug('Native JSON encoder returned undefined.');
                retVal = null;
            }
            return retVal;
        }

        var value = mixed_val;

        var quote = function (string) {
            var escapable = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
            var meta = { // table of character substitutions
                '\b': '\\b',
                '\t': '\\t',
                '\n': '\\n',
                '\f': '\\f',
                '\r': '\\r',
                '"': '\\"',
                '\\': '\\\\'
            };

            escapable.lastIndex = 0;
            return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' : '"' + string + '"';
        };

        var str = function (key, holder) {
            var gap = '';
            var indent = '';
            var i = 0; // The loop counter.
            var k = ''; // The member key.
            var v = ''; // The member value.
            var length = 0;
            var mind = gap;
            var partial = [];
            var value = holder[key];

            // If the value has a toJSON method, call it to obtain a replacement value.
            if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
                value = value.toJSON(key);
            }

            // What happens next depends on the value's type.
            switch (typeof value) {
            case 'string':
                return quote(value);

            case 'number':
                // JSON numbers must be finite. Encode non-finite numbers as null.
                return isFinite(value) ? String(value) : 'null';

            case 'boolean':
            case 'null':
                // If the value is a boolean or null, convert it to a string. Note:
                // typeof null does not produce 'null'. The case is included here in
                // the remote chance that this gets fixed someday.
                return String(value);

            case 'object':
                // If the type is 'object', we might be dealing with an object or an array or
                // null.
                // Due to a specification blunder in ECMAScript, typeof null is 'object',
                // so watch out for that case.
                if (!value) {
                    return 'null';
                }
//                 if ((this.PHPJS_Resource && value instanceof this.PHPJS_Resource) || (window.PHPJS_Resource && value instanceof window.PHPJS_Resource)) {
//                     throw new SyntaxError('json_encode');
//                 }

                // Make an array to hold the partial results of stringifying this object value.
                gap += indent;
                partial = [];

                // Is the value an array?
                if (Object.prototype.toString.apply(value) === '[object Array]') {
                    // The value is an array. Stringify every element. Use null as a placeholder
                    // for non-JSON values.
                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }

                    // Join all of the elements together, separated with commas, and wrap them in
                    // brackets.
                    v = partial.length === 0 ? '[]' : gap ? '[' + gap + partial.join(',' + gap) + '' + mind + ']' : '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }

                // Iterate through all of the keys in the object.
                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }

                // Join all of the member texts together, separated with commas,
                // and wrap them in braces.
                v = partial.length === 0 ? '{}' : gap ? '{' + gap + partial.join(',' + gap) + '' + mind + '}' : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
            case 'undefined':
                // Fall-through
            case 'function':
                /* falls through */
            default:
                fCore.debug('Cannot encode type %s', typeof value);
            }
        };

        // Make a fake root object containing our value under the key of ''.
        // Return the result of stringifying the value.
        return str('', {
            '': value
        });

    } catch (err) {
        // (i.e., when the JSON global is not available and there is an error)
        if (!(err instanceof SyntaxError)) {
            fCore.debug('Unexpected error type in non-native JSON encoder. Returning null.');
        }
        fJSON.lastError = 4;
    }
    return '';
};
