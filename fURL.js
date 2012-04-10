/**
 * Provides functionality to retrieve and manipulate URL information.
 *
 * This classes uses <code>window.location</code> for all operations.
 * @constructor
 */
var fURL = function () {};
/**
 * Returns the requested URL, does not include the domain name or query string.
 * @returns {string} The requested URL without the query string.
 */
fURL.get = function () {
  return location.pathname;
};
/**
 * Returns the current domain name, with protocol prefix.
 * @returns {string} The current domain name, prefixed by <code>http://</code>
 *   or <code>https://</code>.
 */
fURL.getDomain = function () {
  return location.protocol + '//' + location.hostname;
};
/**
 * Returns the current query string.
 * @returns {string} The query string.
 */
fURL.getQueryString = function () {
  return location.search ? location.search.substr(1) : '';
};
/**
 * Returns the current URL including query string, but without domain name.
 * @returns {string} The URL with the query string.
 */
fURL.getWithQueryString = function () {
  return fURL.getDomain() + fURL.get() + '?' + fURL.getQueryString();
};
/**
 * Changes a string into a URL-friendly string.
 * @param {string} string The string to convert.
 * @param {number} [maxLength=null] The maximum length of the friendly URL.
 * @param {string} [delimiter=_] The delimiter to use between words.
 * @returns {string} The URL-friendly version of the string.
 */
fURL.makeFriendly = function (string, maxLength, delimiter) {
  if (typeof maxLength === 'string') {
    delimiter = maxLength;
    maxLength = null;
  }
  if (!delimiter) {
    delimiter = '_';
  }

  //string = fHTML.decode(fUTF8.ascii(string));
  string = string.toLowerCase().replace(/'/g, '');

  var delimiterReplacement = strtr(delimiter, {'\\': '\\\\', '$': '\\$'});
  var delimiterRegex = delimiter.replace(/[.\\+*?\[\^\]$(){}=!<>|:\#-]/g, '\\$&');

  string = string.replace(/[^a-z0-9\-_]+/g, delimiterReplacement);
  string = string.replace(new RegExp(delimiterRegex + '{2,}'), delimiterReplacement);
  string = string.replace(/_\-_/g, '-');
  string = string.replace(new RegExp('(^' + delimiterRegex + '+|' + delimiterRegex + '+$)'), '');

  var length = string.length;
  if (maxLength && length > maxLength) {
    var lastPos = fUTF8.rpos(string, delimiter, (length - maxLength - 1) * -1);
    if (lastPos < Math.ceil(maxLength / 2)) {
      lastPos = maxLength;
    }
    string = string.substr(0, lastPos);
  }

  return string;
};
/**
 * Redirects to the URL specified, without requiring a fully-qualified URL.
 * @param {string} url The URL to redirect to.
 */
fURL.redirect = function (url) {
  location.href = url;
};
