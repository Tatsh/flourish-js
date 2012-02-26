/*jshint sub:true */

/**
 * Provides low-level debugging functionality.
 * @constructor
 */
var fCore = function () {};
/**
  * @type boolean
  * @private
  */
fCore._debugEnabled = false;
/**
  * Returns is the current OS is one of the OSes passed as a parameter.
  *
  * Valid OS strings are:
  * <ul>
  * <li>'linux'</li>
  * <li>'bsd'</li>
  * <li>'osx'</li>
  * <li>'windows'</li>
  * </ul>
  *
  * Try others but the above are guaranteed to work to a degree.
  * @param [args] Variable number of arguments.
  * @returns {boolean} If the current OS is included in the list of OSes passed
  *   as parameters.
  */
fCore.checkOS = function (args) {
  var os = [], i;
  var ua = navigator.userAgent;

  for (i = 0; i < arguments.length; i++) {
    if (ua.match(new RegExp(arguments[i], 'i'))) {
      return true;
    }
  }

  return false;
};
/**
  * <p>Logs a message. Must call enableDebugging() first with true or this
  *   method does nothing.</p><p>To see messages in IE versions prior to 8, you
  *   must have debugging enabled ('Disable Debugging' not checked) and have
  *   Visual Studio attached to the Script process (<em>Script,x86</em>).</p>
  * @param {string} fmt The format string is composed of zero or more
  *   directives: ordinary characters (excluding %) that are copied directly to
  *   the result, and conversion specifications, each of which results in
  *   fetching its own parameter.
  * @param [args] Variable number of arguments specified according to the format
  *   string.
  * @returns {Object} The object to allow method chaining.
  */
fCore.debug = function (fmt, args) {
  if (fCore._debugEnabled) {
    var message = sprintf.apply(fCore, arguments);

    if (window['Debug'] && window['Debug'].writeln) {
      window['Debug'].writeln(message);
    }
    else if (window['opera'] && window['opera'].postError) {
      window['opera'].postError(message);
    }
    else if (window.console) {
      window.console.log(message);
    }
  }

  return fCore;
};
/**
  * Enables or disables debugging globally.
  * @param {boolean} bool Boolean value, true or false.
  * @returns {Object} The fCore object to allow method chaining.
  * @see fCore#debug
  */
fCore.enableDebugging = function (bool) {
  fCore._debugEnabled = bool ? true : false;
  return fCore;
};
/**
  * If debugging is enabled.
  * @returns {boolean} If debugging is enabled.
  */
fCore.getDebug = function () {
  return fCore._debugEnabled;
};
